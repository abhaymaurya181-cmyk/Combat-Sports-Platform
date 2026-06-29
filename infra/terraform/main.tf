terraform {
  required_version = ">= 1.7.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.28"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.30"
    }
  }

  # Uncomment and configure remote state once GCS bucket is provisioned
  # backend "gcs" {
  #   bucket = "combat-sports-tf-state"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# ─── Enable Required APIs ──────────────────────────────────────────────────────

resource "google_project_service" "compute" {
  project            = var.project_id
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "container" {
  project            = var.project_id
  service            = "container.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "sqladmin" {
  project            = var.project_id
  service            = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "redis" {
  project            = var.project_id
  service            = "redis.googleapis.com"
  disable_on_destroy = false
}

# ─── VPC Network ──────────────────────────────────────────────────────────────

resource "google_compute_network" "combat_sports_vpc" {
  name                    = "combat-sports-vpc"
  project                 = var.project_id
  auto_create_subnetworks = false
  depends_on              = [google_project_service.compute]
}

resource "google_compute_subnetwork" "combat_sports_subnet" {
  name          = "combat-sports-subnet"
  project       = var.project_id
  region        = var.region
  network       = google_compute_network.combat_sports_vpc.id
  ip_cidr_range = "10.10.0.0/24"
}

# ─── Firewall Rules ───────────────────────────────────────────────────────────

resource "google_compute_firewall" "allow_internal" {
  name    = "combat-sports-allow-internal"
  project = var.project_id
  network = google_compute_network.combat_sports_vpc.name

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = ["10.10.0.0/24"]
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "combat-sports-allow-ssh"
  project = var.project_id
  network = google_compute_network.combat_sports_vpc.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["k3s-node"]
}

resource "google_compute_firewall" "allow_k3s_api" {
  name    = "combat-sports-allow-k3s-api"
  project = var.project_id
  network = google_compute_network.combat_sports_vpc.name

  allow {
    protocol = "tcp"
    ports    = ["6443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["k3s-master"]
}

resource "google_compute_firewall" "allow_http_https" {
  name    = "combat-sports-allow-http-https"
  project = var.project_id
  network = google_compute_network.combat_sports_vpc.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["k3s-node"]
}
