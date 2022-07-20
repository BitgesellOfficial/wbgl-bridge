FROM debian:bullseye-slim

RUN apt-get update -y \
    && apt-get install curl ca-certificates apt-transport-https bash perl -y \
    && apt-get clean

RUN curl -L "http://security.ubuntu.com/ubuntu/pool/main/p/perl/perl-modules-5.30_5.30.0-9ubuntu0.2_all.deb" -o "/var/tmp/perl-modules.deb" \
    && curl -L "https://github.com/BitgesellOfficial/bitgesell/releases/download/0.1.8/bitgesell_0.1.8_amd64.deb" -o "/var/tmp/bitgesell.deb" \
    && dpkg -i "/var/tmp/perl-modules.deb" \
    && dpkg -i "/var/tmp/bitgesell.deb" \
    && apt-get install -y -f \
    && rm -rf "/var/tmp/*"

WORKDIR "/root/.BGL"

COPY BGL.conf .

EXPOSE 8455

VOLUME "/root/.BGL"

CMD ["BGLd"]
