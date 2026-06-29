output "k3s_master_external_ip" {
  description = "External IP of the k3s master node"
  value       = google_compute_instance.k3s_master.network_interface[0].access_config[0].nat_ip
}

output "k3s_master_internal_ip" {
  description = "Internal IP of the k3s master node"
  value       = google_compute_instance.k3s_master.network_interface[0].network_ip
}

output "k3s_worker_external_ips" {
  description = "External IPs of k3s worker nodes"
  value = [
    for w in google_compute_instance.k3s_workers : w.network_interface[0].access_config[0].nat_ip
  ]
}

output "k3s_worker_internal_ips" {
  description = "Internal IPs of k3s worker nodes"
  value = [
    for w in google_compute_instance.k3s_workers : w.network_interface[0].network_ip
  ]
}

output "k3s_api_endpoint" {
  description = "k3s API server endpoint"
  value       = "https://${google_compute_instance.k3s_master.network_interface[0].access_config[0].nat_ip}:6443"
}

output "ssh_commands" {
  description = "SSH commands to connect to each node"
  value = {
    master = "gcloud compute ssh ${google_compute_instance.k3s_master.name} --zone=${var.zone} --project=${var.project_id}"
    workers = [
      for w in google_compute_instance.k3s_workers :
      "gcloud compute ssh ${w.name} --zone=${var.zone} --project=${var.project_id}"
    ]
  }
}
