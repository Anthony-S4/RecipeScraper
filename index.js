import * as cheerio from 'cheerio';
import promptSync from 'prompt-sync';
const prompt = promptSync();
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
      const $shipped = $('[data-test-id= "ingredients-list"] [data-test-id="ingredient-item-shipped"]');
      const $not_shipped = $('[data-test-id= "ingredients-list"] [data-test-id="ingredient-item-not-shipped"]');
      //We need to create an array to hold each element of the wrapper 
      let shipped  = [];
      let not_shipped  = [];
      //iterate through the cherio object wrapper and push each element into our array
      $shipped.each((i, div) => {
        shipped.push($(div).text());
    });
    $not_shipped.each((i, div) => {
      not_shipped.push($(div).text());
  });
    //Since the sytax of the website does not place a space between the unit and ingredient, insert a space manually below
    shipped = itemsFormat(shipped)
    not_shipped = itemsFormat(not_shipped)
    //combine shipped and non shipped ingredients arrays
    let ingredients = shipped.concat(not_shipped)
    
    //print result
    console.log(ingredients)

    } catch (error) {
      console.log(error);
    }
  }

//function will take in an array of items and format them so there is a space between each unit of measurement and the ingredient
function itemsFormat(items){
  //holder array to be returned b/c replace does not modify original array
  let final = items 
  let filter = ["ounce","unit","tablespoon","teaspoon","cup"]
  for(let i=0; i<items.length; i++)
  {
      for(let j=0; j<filter.length; j++)
      {
          if(items[i].includes(filter[j]))
          {
              final[i]= items[i].replace(filter[j], filter[j] + " ")
          }
      }
  }
  return final
}

//var recipe = prompt("What recipe would you like to retrieve? ");
getItems('https://www.hellofresh.com/recipes/sheet-pan-italian-organic-beef-meatloaves-649c8afbd54520eb5aba9c1b');