job "lazztechhub-service" {
  datacenters = ["dc1"]
  type = "service"

  group "lazztechhub" {
    count = 1

    ephemeral_disk {
      sticky = true
      migrate = true
      size = 300
    }

    task "lazztechhub-service" {
      driver = "docker"

      config {
        image = "registry.lazz.tech/lazztechhub-service"
        port_map {
          http = 8080
        }
      }
      resources {
        cpu    = 500 # 500 MHz
        memory = 256 # 256MB

        network {
          mbits = 10
          port "http" {}
        }
      }

      service {
        name = "prod-lazztechhub"
        port = "http"

        tags = [
          "traefik.enable=true",
          "traefik.http.routers.prod-lazztechhub.rule=Host(`prod-lazztechhub.lazz.tech`)",
          "traefik.http.routers.prod-lazztechhub.tls.certresolver=cloudflare"
        ]

        check {
          type     = "http"
          path     = "/health"
          interval = "2s"
          timeout  = "2s"
        }
      }
    }
  }
}
