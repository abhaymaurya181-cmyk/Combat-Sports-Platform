# ─── Cloudflare DNS ───────────────────────────────────────────────────────────
# Uncomment this block after:
#   1. Setting cloudflare_api_token and cloudflare_zone_id in terraform.tfvars
#   2. Running: terraform init (to download the cloudflare provider)
#
# provider "cloudflare" {
#   api_token = var.cloudflare_api_token
# }
#
# # Root domain → k3s master
# resource "cloudflare_record" "root" {
#   zone_id = var.cloudflare_zone_id
#   name    = "@"
#   value   = google_compute_instance.k3s_master.network_interface[0].access_config[0].nat_ip
#   type    = "A"
#   ttl     = 300
#   proxied = true
# }
#
# # www subdomain
# resource "cloudflare_record" "www" {
#   zone_id = var.cloudflare_zone_id
#   name    = "www"
#   value   = var.domain_name
#   type    = "CNAME"
#   ttl     = 1     # Automatic (proxied)
#   proxied = true
# }
#
# # API subdomain → k3s master
# resource "cloudflare_record" "api" {
#   zone_id = var.cloudflare_zone_id
#   name    = "api"
#   value   = google_compute_instance.k3s_master.network_interface[0].access_config[0].nat_ip
#   type    = "A"
#   ttl     = 300
#   proxied = true
# }
#
# # Grafana monitoring subdomain
# resource "cloudflare_record" "grafana" {
#   zone_id = var.cloudflare_zone_id
#   name    = "grafana"
#   value   = google_compute_instance.k3s_master.network_interface[0].access_config[0].nat_ip
#   type    = "A"
#   ttl     = 300
#   proxied = false   # Direct access for metrics
# }
