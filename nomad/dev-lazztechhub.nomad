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
      vault {
        policies = ["lazztechhub"]
      }
      template {
        data = <<EOF
APP_NAME="Lazztech Hub Dev"

{{- with secret "kv/data/lazztechhub-dev" -}}
ACCESS_TOKEN_SECRET={{ .Data.data.access_token_secret }}
FIREBASE_SERVER_KEY={{ .Data.data.firebase_server_key }}

AzureWebJobsStorage={{ .Data.data.azure_web_jobs_storage }}
EMAIL_FROM_ADDRESS={{ .Data.data.email_from_address }}
EMAIL_PASSWORD={{ .Data.data.email_password }}
PUSH_NOTIFICATION_ENDPOINT=https://fcm.googleapis.com/fcm/send
{{ end }}
EOF
        destination = "secrets/file.env"
        env         = true
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
        name = "dev-lazztechhub"
        port = "http"

        tags = [
          "traefik.enable=true",
          "traefik.http.routers.dev-lazztechhub.rule=HostRegexp(`dev-lazztechhub.lazz.tech`)"
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
