FROM nginx:latest

COPY stage/conf.d/ /etc/nginx/conf.d/

RUN mkdir -p /etc/ssl/certs/geega.test/ && \
	openssl req \
		-x509 \
		-nodes \
		-days 365 \
		-subj "/C=CA/ST=QC/O=Underworld Inc./CN=geega.test" \
		-addext "subjectAltName=DNS:geega.test" \
		-newkey rsa:2048 \
		-keyout /etc/ssl/certs/geega.test/geega.test.key \
		-out /etc/ssl/certs/geega.test/geega.test.crt;
