import axios from 'axios';
import fs from 'fs';
import { stringify } from 'csv-stringify/sync';

const contCSV = [];

const CSVWrite = (filePath, data, encoding = 'utf-8') => {
    const promiseCallback = (resolve, reject) => {
        fs.writeFile(filePath, data , encoding, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(true);
        });
    };
    return new Promise(promiseCallback);
    
};

const start = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151')
    
    const data = response.data.results;
    
    const colunas = ['id', 'name','height', 'weight', 'tipo1', 'tipo2']      
    contCSV.push(colunas);

    for(const item of data) {
        const fileData = [];
        const {data} = await axios.get(item.url);
               
        fileData.push(data.id);
        fileData.push(data.name);
        fileData.push(data.height);
        fileData.push(data.weight);
                
        fileData.push(data.types[0].type.name);
        
        fileData.push(data.types[1]?.type.name);
        
        //console.log(data.types);
        contCSV.push(fileData);       
    }

    const output = stringify(contCSV);
    await CSVWrite('./listpokemon.csv', output);
    console.log ('Feito!');
    
};

start ();