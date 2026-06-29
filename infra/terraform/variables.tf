variable "project_id" {
  description = "GCP Project ID"
  type        = string
  # Set via terraform.tfvars or TF_VAR_project_id env var
}

variable "region" {
  description = "GCP region for all resources"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone for zonal resources"
  type        = string
  default     = "us-central1-a"
}

variable "k3s_version" {
  description = "k3s version to install on GCE instances"
  type        = string
  default     = "v1.29.4+k3s1"
}

variable "master_machine_type" {
  description = "GCE machine type for k3s master node"
  type        = string
  default     = "n2-standard-2"
}

variable "worker_machine_type" {
  description = "GCE machine type for k3s worker nodes"
  type        = string
  default     = "n2-standard-2"
}

variable "worker_count" {
  description = "Number of k3s worker nodes"
  type        = number
  default     = 2
}

variable "ssh_public_key" {
  description = "SSH public key for GCE instance access"
  type        = string
  default     = ""
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token (set in terraform.tfvars, NOT in version control)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for your domain"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Root domain name (e.g. combatsports.io)"
  type        = string
  default     = ""
}
