# Provider
# Tells Terraform we are using Azure
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# Resource Group

resource "azurerm_resource_group" "main" {
  name     = "${var.project_name}-rg"
  location = var.location
}

# Virtual Network
# The private network that all your VMs will live in

resource "azurerm_virtual_network" "vnet" {
  name                = "${var.project_name}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

# Subnets
# Public subnet for the bastion host

resource "azurerm_subnet" "public" {
  name                 = "${var.project_name}-public-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Private subnet

resource "azurerm_subnet" "private" {
  name                 = "${var.project_name}-private-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"]
}

# Security Groups
# Controls what traffic is allowed
# Bastion host security group

resource "azurerm_network_security_group" "bastion_nsg" {
  name                = "${var.project_name}-bastion-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "AllowSSH"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    # checkov:skip=CKV_AZURE_10: SSH access is required for remote administration
    source_address_prefix      = var.admin_ip_allow
    destination_address_prefix = "*"
  }
}

# App VM security group

resource "azurerm_network_security_group" "app_nsg" {
  name                = "${var.project_name}-app-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  # Allow HTTP traffic from internet
  
  security_rule {
    name                       = "AllowHTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # Allow SSH only from the public subnet

  security_rule {
    name = "AllowSSHFromBastion"
    priority = 110
    direction = "Inbound"
    access = "Allow"
    protocol = "Tcp"
    source_port_range = "*"
    destination_port_range = "22"
    source_address_prefix = "10.0.1.0/24"
    destination_address_prefix = "*"
  }
}

# Public IP for bastion

resource "azurerm_public_ip" "bastion_pip" {
  name = "${var.project_name}-bastion-pip"
  location = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method = "Static"
  sku = "Standard"
}

# Network Interfaces
# Network interface for bastion host

resource "azurerm_network_interface" "bastion_nic" {
  name = "${var.project_name}-bastion-nic"
  location = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name = "bastion-ip-config"
    subnet_id = azurerm_subnet.public.id
    private_ip_address_allocation = "Dynamic"
    # checkov:skip=CKV_AZURE_119: Bastion host requires a public IP for management access
    public_ip_address_id = azurerm_public_ip.bastion_pip.id
  }
}

# Network interface for app VM

resource "azurerm_network_interface" "app_nic" {
  name = "${var.project_name}-app-nic"
  location = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name = "app-ip-config"
    subnet_id = azurerm_subnet.private.id
    private_ip_address_allocation = "Dynamic"
  }
}

# Associate NSGs with NICs

resource "azurerm_network_interface_security_group_association" "bastion" {
  network_interface_id = azurerm_network_interface.bastion_nic.id
  network_security_group_id = azurerm_network_security_group.bastion_nsg.id
}

resource "azurerm_network_interface_security_group_association" "app" {
  network_interface_id = azurerm_network_interface.app_nic.id
  network_security_group_id = azurerm_network_security_group.app_nsg.id
}

# Bastion Host VM
# Small public VM used as a gateway to SSH into the private app VM

resource "azurerm_linux_virtual_machine" "bastion" {
  # checkov:skip=CKV_AZURE_50: Virtual Machine Extensions not required for this workload
  name = "${var.project_name}-bastion"
  location = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  size = var.bastion_vm_size
  admin_username = var.admin_username
  disable_password_authentication = true
  network_interface_ids = [azurerm_network_interface.bastion_nic.id]

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.ssh_public_key
  }

  os_disk {
    caching = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer = "0001-com-ubuntu-server-jammy"
    sku = "22_04-lts"
    version = "latest"
  }
}

# App VM
# Private VM where Django app will run

resource "azurerm_linux_virtual_machine" "app" {
  # checkov:skip=CKV_AZURE_50: Virtual Machine Extensions not required for this workload
  name = "${var.project_name}-app-vm"
  location = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  size = var.vm_size
  admin_username = var.admin_username
  disable_password_authentication = true
  network_interface_ids = [azurerm_network_interface.app_nic.id]

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.ssh_public_key
  }

  os_disk {
    caching = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer = "0001-com-ubuntu-server-jammy"
    sku = "22_04-lts"
    version = "latest"
  }
}

# Azure Container Registry
# Private registry for storing Docker images

resource "azurerm_container_registry" "acr" {
  name = "${var.project_name}acr"
  resource_group_name = azurerm_resource_group.main.name
  location = azurerm_resource_group.main.location
  sku      = "Premium" # Required for several security features
  admin_enabled = false
  
  # checkov:skip=CKV_AZURE_139: Public networking enabled for remote access during development
  public_network_access_enabled = true 
  
  # checkov:skip=CKV_AZURE_165: Geo-replication not required for this environment
  # checkov:skip=CKV_AZURE_166: Quarantine policy not required for this environment
  # checkov:skip=CKV_AZURE_164: Trusted images policy not required for this environment
  
  data_endpoint_enabled   = true
  zone_redundancy_enabled = true

  network_rule_set {
    default_action = "Allow"
  }

  retention_policy {
    days    = 7
    enabled = true
  }
}

# Azure Database for PostgreSQL - Flexible Server
# The database for our application

resource "azurerm_postgresql_flexible_server" "db" {
  name                   = "${var.project_name}-psql-server"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "16"
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  storage_mb             = 32768
  sku_name               = "GP_Standard_D2s_v3" # General Purpose for more features
  
  backup_retention_days        = 7
  geo_redundant_backup_enabled = true
}

resource "azurerm_postgresql_flexible_server_database" "db" {
  name      = "${var.project_name}db"
  server_id = azurerm_postgresql_flexible_server.db.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}