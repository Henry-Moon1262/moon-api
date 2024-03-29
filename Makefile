all:
	@echo all: Do nothing

start:
	@pm2 start

restart:
	@pm2 restart gcp-billing-api

recreate:
	@pm2 delete gcp-billing-api
	@pm2 start

delete:
	@pm2 delete gcp-billing-api

clean-branches:
	@git --no-pager branch HG-* --list --format "%(refname:short)" \
		| xargs git branch -D 

-include local.mk
