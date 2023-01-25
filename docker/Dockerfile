FROM ubuntu:20.04 as builder

ARG VERSION=0.1.9

RUN apt update \
    && apt install -y --no-install-recommends \
    libatomic1 \
    wget \
    ca-certificates \ 
    apt-transport-https 

RUN cd /tmp/ \
    && wget https://github.com/BitgesellOfficial/bitgesell/releases/download/${VERSION}/bitgesell_${VERSION}_amd64.deb \
    && wget http://ports.ubuntu.com/pool/main/p/perl/perl-modules-5.30_5.30.0-9build1_all.deb \
    && dpkg -i perl-modules-5.30_5.30.0-9build1_all.deb \
    && dpkg -i bitgesell_${VERSION}_amd64.deb \
    && apt-get install -y -f \
    && apt clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN cd /tmp/ \
    && wget https://github.com/BitgesellOfficial/bitgesell/releases/download/${VERSION}/bitgesell_${VERSION}_amd64.deb \
    && wget http://ports.ubuntu.com/pool/main/p/perl/perl-modules-5.30_5.30.0-9build1_all.deb \
    && dpkg -i perl-modules-5.30_5.30.0-9build1_all.deb \
    && dpkg -i bitgesell_${VERSION}_amd64.deb \
    && apt-get install -y -f \
    && apt clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR "/root/.BGL"

COPY BGL.conf .

EXPOSE 8455

VOLUME "/root/.BGL"

CMD ["BGLd"]
