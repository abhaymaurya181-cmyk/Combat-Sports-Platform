# Terraform — GCP Infrastructure

Provisions a k3s Kubernetes cluster on GCE (1 master + 2 workers) along with required networking, firewall rules, and optional Cloudflare DNS records.

## Prerequisites

- [Terraform >= 1.7](https://developer.hashicorp.com/terraform/install)
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) authenticated with a project
- A GCP project with billing enabled

## Quick Start

### 1. Configure variables

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set project_id, and optionally cloudflare_api_token
```

`terraform.tfvars` (not committed):
```hcl
project_id           = "my-gcp-project-id"
region               = "us-central1"
zone                 = "us-central1-a"
ssh_public_key       = "ssh-ed25519 AAAA..."
# cloudflare_api_token = "..."
# cloudflare_zone_id   = "..."
# domain_name          = "combatsports.io"
```

### 2. Initialise Terraform

```bash
terraform init
```

### 3. Plan

```bash
terraform plan -out=tfplan
```

Review the plan — it will create:
- 1x VPC + subnet
- 4x firewall rules
- 1x k3s master GCE instance (n2-standard-2)
- 2x k3s worker GCE instances (n2-standard-2)

### 4. Apply

```bash
terraform apply tfplan
```

### 5. Get kubeconfig

After apply, SSH into the master and copy the kubeconfig:

```bash
gcloud compute ssh combat-sports-k3s-master --zone=us-central1-a
# On master:
sudo cat /etc/rancher/k3s/k3s.yaml
```

Replace `127.0.0.1` with the master's external IP, then save to `~/.kube/config`.

### 6. Destroy

```bash
terraform destroy
```

## Cloudflare DNS

Uncomment the resources in `cloudflare.tf` and add your API token to `terraform.tfvars` to manage DNS records automatically.
