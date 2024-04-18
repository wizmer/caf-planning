# instruction source: https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql.service

# log as postgres user
sudo -i -u postgres

##### IN POSTGRES SHELL ######
createuser bcoste
createdb bcoste
\password # setup your password value


##### END PSQL SHELL ####

