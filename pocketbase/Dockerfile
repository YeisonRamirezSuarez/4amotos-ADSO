# Lightweight PocketBase image for Fly.io
# Builds from Alpine and downloads the requested PocketBase release.

ARG PB_VERSION=0.30.0
ARG PB_OS=linux
ARG PB_ARCH=amd64

FROM alpine:3.20

# Re-declare args for the final stage
ARG PB_VERSION
ARG PB_OS
ARG PB_ARCH

WORKDIR /pb

RUN apk add --no-cache ca-certificates unzip wget tini \
  && addgroup -S pb && adduser -S pb -G pb \
  && wget -O /tmp/pocketbase.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${PB_OS}_${PB_ARCH}.zip" \
  && unzip /tmp/pocketbase.zip -d /tmp \
  && mv /tmp/pocketbase /pb/pocketbase \
  && chmod +x /pb/pocketbase \
  && rm /tmp/pocketbase.zip

COPY pb_migrations /pb/pb_migrations
COPY pb_data /pb/pb_seed
COPY entrypoint.sh /entrypoint.sh

RUN mkdir -p /pb/pb_data /pb/pb_public /pb/pb_hooks \
  && chown -R pb:pb /pb /entrypoint.sh \
  && chmod +x /entrypoint.sh

USER pb

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]
