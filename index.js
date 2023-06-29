import * as cheerio from 'cheerio';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
//function that will take in link, then return recipe items, currently however it just acquires all recipe items from a hard coded link
async function getItems(a) { 
    try {
      //await is used so that server data can load before calling methods
      //fetch takes a path and returns a promise that resolves with a response object
      const response = await fetch (a); 
      //the response object is a represenation of the http response, as such to transform it into html text use .text()
      const body = await response.text();
      //cheerio.load is used to load the HTML string and transform it into a cheerio object, this object can be used to traverse the DOM
      const $ = cheerio.load(body);
      //$name is convention, here we use the cheerio object to select al elemnts that are descendants specified as [data-test-id="ingredient-item-shipped"] of the attribute [data-test-id= "ingredients-list"] 
      const $wrapper4 = $('[data-test-id= "ingredients-list"] [data-test-id="ingredient-item-shipped"]');
      //We need to create an array to hold each element of the wrapper 
      let uitems = [];

      //iterate through the cherio object wrapper and push each element into our array
      $wrapper4.each((i, div) => {
        //console.log($(div).text());
        uitems.push($(div).text());
    });
    //Since the sytax of the website does not place a space between the unit and ingredient, insert a space manually below
    for(let i=0; i<uitems.length; i++)
    {
      if(uitems[i].includes("ounce"))
      {
        //create temp result variable b/c string immutable, but arrays are not so just set array index value to new string
        let result = uitems[i].replace("ounce", "ounce" + " ")
        uitems[i] = result
      }
      if(uitems[i].includes("unit"))
      {
        let result = uitems[i].replace("unit", "unit" + " ")
        uitems[i] = result
      }
      if(uitems[i].includes("tablespoon"))
      {
        let result = uitems[i].replace("tablespoon", "tablespoon" + " ")
        uitems[i] = result
      }
    }
    //print
    console.log(uitems)
    } catch (error) {
      console.log(error);
    }
  }
getItems('https://www.hellofresh.com/recipes/peppercorn-steak-w06-5857fcd16121bb11c124f383');