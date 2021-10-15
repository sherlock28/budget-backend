# API Personal Budget - Backend 2021  

API Rest construida con Express y MySQL y ofrece endpoints para crear y editar ingresos y egresos de dinero y mostrar un balance resultante de las
operaciones registradas.

## Instalación

_Primero debe ejecutar el script sql que creara la base de datos, sus tablas y algunos datos de prueba iniciales. El script se encuentra en la carpeta database/db.sql_

_Una vez se haya completado la creacion de la basa de datos debe crear el archivo .env en la raiz del proyecto con las siguientes variables de entorno:_

```
- NODE_ENV=development
- PORT=4000
- HOST=localhost
- USER_DB=your-user-db
- PASSWORD_DB=your-password-db
- DATABASE=database_budget
```
_Por ultimo, ejecutar el comando npm install para instalar las dependencias y a continuacion npm run dev para iniciar el servidor._
```
- npm install
- npm run dev
```
## Como usar

_Tomando como ejemplo una ejecución local, dispone de los siguientes endpoints:_

### endpoints operations (':id' se refiere a una variable)
```
- [GET]     http://localhost:4000/api/operations
- [POST]    http://localhost:4000/api/operations
- [DELETE]  http://localhost:4000/api/operations
- [PUT]     http://localhost:4000/api/operations/:id
- [GET]     http://localhost:4000/api/operations/entries
- [GET]     http://localhost:4000/api/operations/outputs
```
### endpoints balance (':id' se refiere a una variable)
```
- [GET] http://localhost:4000/api/balances/:id
```
### Formatos de entrada de datos

- Para registrar un usuario:
```json
  {
   "concept": "concept-example",
   "amount": "amount-example",
   "date_registered": "date-example",
   "type_operation": "operation-type-example",
  }
 ```
    
- Un ejemplo podría verse de la siguiente forma:
  {
   "concept": "Cobro deuda",
   "amount": 5000,
   "date_registered": "2021-03-20",
   "type_operation": "Ingreso",
  }

### Formatos de salida de datos

- Un salida basada en el ejemplo anterior se vería de la siguiente forma:
  
 ```json
  {
   "data": {
      "operations": [
          {
            "id": 1,
            "concept": "Cobro deuda",
            "amount": 5000,
            "date_registered": "2021-03-20T03:00:00.000Z",
            "type_operation_id": 1
          }
      ]
   }
  ```
 - Para el endpoint http://localhost:4000/api/balances/:id un ejemplo de la salida seria la siguiente: 
 ```json
  { 
    "data": {
       "balance": {
            "id": 1,
            "last_balance": 5000
        }
    }
  }
  ```
- El formato para las fechas es:
  - `yyyy-mm-dd`

## Construido con

- Node.js
- Express.js
- MySQL
