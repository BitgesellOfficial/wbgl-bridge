FROM debian:bullseye-slim

RUN apt-get update -y \
    && apt-get install curl ca-certificates apt-transport-https bash perl -y \
    && apt-get clean

RUN curl -L "http://ftp.de.debian.org/debian/pool/main/p/perl/perl-modules-5.30_5.30.3-4_all.deb" -o "/var/tmp/perl-modules-5.30_5.30.3-4_all.deb" \
    && curl -L "https://github.com/BitgesellOfficial/bitgesell/releases/download/0.1.6/bitgesell_0.1.6_amd64.deb" -o "/var/tmp/bitgesell.deb" \
    && dpkg -i "/var/tmp/perl-modules-5.30_5.30.3-4_all.deb" \
    && dpkg -i "/var/tmp/bitgesell.deb" \
    && apt-get install -y -f \
    && rm -rf "/var/tmp/*"

WORKDIR "/root/.BGL"

COPY BGL.conf .

EXPOSE 8455

VOLUME "/root/.BGL"

CMD ["BGLd"]
