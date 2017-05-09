FROM ubuntu:16.04

# install mongodb
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6 \
    && echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | \
    tee /etc/apt/sources.list.d/mongodb-org-3.4.list

RUN apt-get update \
	&& apt-get -y upgrade \
	&& apt-get -y install net-tools iputils-ping vim locales \
	&& apt-get -y install wget git tar ca-certificates curl mongodb-org nodejs npm


ENV LANG=en_US.utf8
ENV LANGUAGE=en_US.utf8
RUN locale-gen en_US.UTF-8

RUN npm cache clean -f \
	&& npm install -g n \
	&& n 6.10.2

RUN npm install -g webpack

COPY . /opt

WORKDIR /opt/SBDocClient
RUN npm install &&  webpack


WORKDIR /opt/SBDoc
RUN npm install

# config file
COPY ./files/mongod.conf /etc/mongod.conf
COPY ./files/config.json /opt/config.json

CMD ["/opt/files/run.sh"]
