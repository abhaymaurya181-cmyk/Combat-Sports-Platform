locals {
  k3s_master_name = "combat-sports-k3s-master"
  k3s_worker_name = "combat-sports-k3s-worker"
  boot_disk_size  = 50  # GB
  boot_disk_type  = "pd-ssd"
  debian_image    = "debian-cloud/debian-12"
}

# ─── k3s Master Node ──────────────────────────────────────────────────────────

resource "google_compute_instance" "k3s_master" {
  name         = local.k3s_master_name
  machine_type = var.master_machine_type
  zone         = var.zone
  project      = var.project_id
  tags         = ["k3s-node", "k3s-master"]

  depends_on = [
    google_project_service.compute,
    google_compute_subnetwork.combat_sports_subnet,
  ]

  boot_disk {
    initialize_params {
      image = local.debian_image
      size  = local.boot_disk_size
      type  = local.boot_disk_type
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.combat_sports_subnet.id
    access_config {
      # Ephemeral public IP
    }
  }

  metadata = {
    ssh-keys = var.ssh_public_key != "" ? "debian:${var.ssh_public_key}" : null
    startup-script = <<-EOT
      #!/bin/bash
      set -euo pipefail

      apt-get update -y
      apt-get install -y curl jq

      # Install k3s master
      curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="${var.k3s_version}" sh -s - server \
        --cluster-init \
        --tls-san "$(curl -s http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip -H 'Metadata-Flavor: Google')" \
        --disable traefik

      # Wait for k3s to be ready
      until kubectl get nodes; do sleep 5; done

      echo "k3s master ready"
    EOT
  }

  service_account {
    scopes = ["cloud-platform"]
  }

  labels = {
    role        = "k3s-master"
    environment = "production"
    project     = "combat-sports"
  }
}

# ─── k3s Worker Nodes ─────────────────────────────────────────────────────────

resource "google_compute_instance" "k3s_workers" {
  count        = var.worker_count
  name         = "${local.k3s_worker_name}-${count.index + 1}"
  machine_type = var.worker_machine_type
  zone         = var.zone
  project      = var.project_id
  tags         = ["k3s-node", "k3s-worker"]

  depends_on = [
    google_compute_instance.k3s_master,
  ]

  boot_disk {
    initialize_params {
      image = local.debian_image
      size  = local.boot_disk_size
      type  = local.boot_disk_type
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.combat_sports_subnet.id
    access_config {
      # Ephemeral public IP
    }
  }

  metadata = {
    ssh-keys = var.ssh_public_key != "" ? "debian:${var.ssh_public_key}" : null
    startup-script = <<-EOT
      #!/bin/bash
      set -euo pipefail

      apt-get update -y
      apt-get install -y curl jq

      # Wait for master to be ready and get token
      MASTER_IP="${google_compute_instance.k3s_master.network_interface[0].network_ip}"

      # Install k3s agent
      curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="${var.k3s_version}" K3S_URL="https://$MASTER_IP:6443" sh -s - agent

      echo "k3s worker ${count.index + 1} ready"
    EOT
  }

  service_account {
    scopes = ["cloud-platform"]
  }

  labels = {
    role        = "k3s-worker"
    index       = tostring(count.index + 1)
    environment = "production"
    project     = "combat-sports"
  }
}
