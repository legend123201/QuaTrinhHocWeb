/*
All JavaScript values, except primitives, are objects.

Booleans can be objects (if defined with the new keyword)
Numbers can be objects (if defined with the new keyword)
Strings can be objects (if defined with the new keyword)
Dates are always objects
Maths are always objects
Regular expressions are always objects
Arrays are always objects
Functions are always objects
Objects are always objects
*/

//---------------NOTE: dù nó tính là objects nhưng khi sử dụng typeof thì có thể ra đúng loại, ví dụ như fuction

/*
// Pour les nombres
typeof 37 === 'number';
typeof 3.14 === 'number';
typeof(42) === 'number';
typeof Math.LN2 === 'number';
typeof Infinity === 'number';
typeof NaN === 'number'; // Bien que littéralement ce soit "Not-A-Number"…
typeof Number('1') === 'number'; // Number essaie de convertir l'argument en nombre

// Grand entier
typeof 42n === 'bigint';

// Les chaînes de caractères
typeof "" === 'string';
typeof "bla" === 'string';
typeof "1" === 'string'; // on a ici un nombre écrit sous forme d'une chaîne
typeof (typeof 1) === 'string'; // typeof renvoie toujours une chaîne
typeof String(1) === 'string'; // String convertit n'importe quelle valeur en chaîne


// Les booléens
typeof true === 'boolean';
typeof false === 'boolean';
typeof Boolean(1) === 'boolean'; // Boolean convertit n'importe quelle valeur en son équivalent logique
typeof !!(1) === 'boolean'; // deux appels à l'opérateur ! (le NON logique) sont équivalents à Boolean()


// Les symboles
typeof Symbol() === 'symbol'
typeof Symbol('foo') === 'symbol'
typeof Symbol.iterator === 'symbol'


// Indéfini
typeof undefined === 'undefined';
typeof blabla === 'undefined'; // pour une variable indéfinie


// Les objets
typeof {a:1} === 'object';

// Utiliser la méthode Array.isArray ou Object.prototype.toString.call
// afin de différencier les objets des tableaux
typeof [1, 2, 4] === 'object';

typeof new Date() === 'object';
typeof /regex/ === 'object'; // Voir la section sur les expressions rationnelles

// Les expressions suivantes sont source de confusion
// à ne pas utiliser sous cette forme
typeof new Boolean(true) === 'object';
typeof new Number(1) === 'object';
typeof new String("abc") === 'object';


// Les fonctions
typeof function(){} === 'function';
typeof class C {} === 'function';
typeof Math.sin === 'function';
*/
