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
        image = "gianlazzarini/lazztechhubbackend"
        port_map {
          http = 80
          https = 443
        }
      }
      resources {
        cpu    = 500 # 500 MHz
        memory = 256 # 256MB

        network {
          mbits = 10
          port "http" {}
          port "https" {}
        }
      }

      service {
        name = "prod-lazztechhub"
        port = "http"

        tags = [
          "traefik.enable=true",
          "traefik.http.routers.prod-lazztechhub.rule=HostRegexp(`prod-lazztechhub.lazz.tech`)"
        ]

        check {
          type     = "http"
          path     = "/"
          interval = "2s"
          timeout  = "2s"
        }
      }
    }
  }
}
