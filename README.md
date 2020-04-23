# Animal Management (BE)
This application provides a front end part of the Animal Management System.

Try it together with the front end app https://github.com/a-lysenko/animal-management-fe

## Steps to start

0. clone this repository
1. **npm install**
2. The app has a configuration to the existing PostgreSQL DB (it is somewhere on AWS).
You may use your own DB if you want. In this case do the following command in row:

**npm run initdb**

**npm run initdb:owners-addresses**

**npm run initdb:pets**
It will prepare DB tables for you

2. **npm run dev** 

**Congrats** Find the application launched on http://localhost:3032 It will immediately shows you some data.

Extra steps to get FE+BE
3. Clone, install and launch FE. It is [here](https://github.com/a-lysenko/animal-management-fe)