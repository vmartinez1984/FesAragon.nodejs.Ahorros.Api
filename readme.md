npm i express mongoose nodemon dotenv

docker build -t duck_bank_v2 .
docker run --name duck_bank_v2 -p 3080:3000 -d duck_bank_v2

3000 es el puerto definido en .env y puerto expuesto en el dockerfile
3080 para marcar en el navegador
