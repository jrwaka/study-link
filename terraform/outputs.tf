# Resource Group

output "resource_group_name" {
  description = "Name of the Azure resource group"
  value = azurerm_resource_group.main.name
}

# Virtual Machine

output "app_vm_private_ip" {
  description = "Private IP of the application VM"
  value = azurerm_network_interface.app_nic.private_ip_address
}

# Bastion Host

output "bastion_public_ip" {
  description = "Public IP of the bastion host"
  value = azurerm_public_ip.bastion_pip.ip_address
}

# Container Registry

output "acr_login_server" {
  description = "ACR login server URL — used to push/pull Docker images"
  value = azurerm_container_registry.acr.login_server
}

# Database

output "db_host" {
  description = "PostgreSQL server FQDN"
  value = azurerm_postgresql_flexible_server.db.fqdn
}