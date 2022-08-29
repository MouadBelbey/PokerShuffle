
/*Mouad Belbey et Van Nam Vu
-- Date : 20/04/2020
-- TP2 - jeu de carte
-- Jeu de Poker Shuffle sur navigateur web.
-- Un jeu qu'on peut deplacer les cartes pour
faire les combinaisons de points de Poker.

-- Petite specification : notre alert sera affiche avec clic juste apres
deplacer la derniere carte a la case vide.

-- Programme est fait avec JS et HTML.
*/

var tabJeu;       //tab carte numerise actualise selon la grille html
var tabGrilleFix; //[[0,1,2,3,4],[5,6,7,8,9],...,[20,21,22,23,24]]
var tabImage;     //tab contient tous les images des cartes
var tabCarteMelange; // tab melange aleatoire les cartes numerises

var totalPoker; //total du jeu

var carteVide = "<img src=\"cards/empty.svg\">"; //image case vide
var carteDos = "<img src=\"cards/back.svg\">";   //image dos de la carte

var card = carteVide ; //stock Image carte pour prochaine clic
var cardPresent;       //Image carte actuelle - pour echanger les pos des cartes
var iden ;             //id html active sert a changer a la prochaine clic
var cardID;            //contient carte numerique
var cardIdPrec;        //contient carte numerique precedent


//-------------------------------Partie genere les tab necessaires--------------

/*Fonction pour creer un tableau des tableaux
calculer valeur sous formule ax+b
Parametre :
- ligne : nombre de lignes
- col : nombre de col
- a : coefficient
- b : ordonnee
*/
var fillMat = function (ligne,col,a,b){
    var tab = Array(ligne).fill(0);

    if(a != 0){ //pour creer tab [[0,1,2,3,4]..[20,21,22,23,24]]
        for (var i = 0; i<ligne; i++){
            tab[i]= fillTable(col,a,i*b);
        }
        return tab;
    } else { //pour creer tab [[52,52,52,52,52]..[52,52,52,52,52]]
        for (var i = 0; i<ligne; i++){
            tab[i]= fillTable(col,a,b);
        }
        return tab;
     }
};

/*Fonction pour creer un tableau
calculer valeur sous formule ax+b
Parametre :
- col : nombre de col
- a : coefficient
- b : ordonnee
*/
var fillTable = function(col,a,b){
    var tab1 = Array(col).fill(0);

    for (var k =0;k<col;k++){
        tab1[k] = k*a+b;
    }
    return tab1;
};

//Fonction cree tab fixe contient image carte
var fillTabImage = function (){
    var tab1 = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    var tab2 = ["C","D","H","S"];

    var a = "<img src=\"cards/";
    var b = ".svg\">";
    var tab = [];

    for (var i = 0; i< tab1.length; i++){
        for (var k = 0; k <tab2.length; k++){
            tab.push(a+tab1[i]+tab2[k]+b);
        }
    }
    return tab;
};

/*Fonction pour melanger les cartes numerisees
Parametre :
- tab : tab Carte numerisee a melanger
*/
var melangeCarte = function (tab){
    for (var i = tab.length - 1; i > 0 ;i--){
        var a = tab[i];
        var random = Math.floor(Math.random()*i);
        tab[i] = tab[random];
        tab[random] = a;
    }
    return tab;
};

tabImage = fillTabImage(); //tab contient tous les images des cartes

//----------------- Pointage---------------------------------------

/*Fonction pour calculer le total (col + rang) du jeu et affiche
sur le navigateur web
*/
var totalJeu = function (){

    var totalCol;
    var totalLigne;

    totalPoker = 0; //total du jeu

    for(var x=0; x < tabGrilleFix.length ; x++ ){

        totalCol = +document.getElementById("C"+x).innerHTML;
        totalLigne = +document.getElementById("R"+x).innerHTML;

        totalPoker += totalCol + totalLigne;
    }
    document.getElementById("T").innerHTML = totalPoker;
    return totalPoker;
};

/*Fonction sert a calculer les points de col et de range d'une case
Parametre :
-cardID : numero de carte numerise
-id : identificateur sur html (position html)
*/
var totalPoint = function (cardID,id){

    var colActuel = indexCol(tabGrilleFix,id);
    var rangActuel = indexRange(tabGrilleFix,id);

    calculPoint(cardID,tabJeu,rangActuel,colActuel);
}

/*Fonction sert a calculer les points de col et de range de id ci-haut
Parametre :
-cardId : numero de carte numerise
-tab : tabJeu -> pour mettre a jour le tab de Jeu
-range : range a calculer le total
-col : colonne a calculer le total
*/
var calculPoint = function (cardId,tab,range,col){

    var totalRange; //total de ligne
    var totalCol; //total de colonne

    tab[range][col] = cardId;
    totalRange = sumRange(tab,range);
    totalCol = sumCol(tab,col);

};

/*Fonction sert a calculer les points de range et affiche sur html
Parametre :
-tab : tabJeu -> pour calculer le total de ce tab
-range : range a calculer le total
*/
var sumRange = function (tab,rang){
    var ligneHTML = document.getElementById("R"+rang);
    var sum = 0;
    var tab1 = [];

    for (var k = 0; k < tab[rang].length; k++){
        tab1.push(tab[rang][k]);
    }

    sum = compterPoint(tab1);

    if (sum != 0){
        return ligneHTML.innerHTML = sum+"";
    }
    return ligneHTML.innerHTML = "";
};

/*Fonction sert a calculer les points de colonne et affiche sur html
Parametre :
-tab : tabJeu -> pour calculer le total de ce tab
-col : colonne a calculer le total
*/
var sumCol = function (tab,col){
    var colHTML = document.getElementById("C"+col);
    var sum = 0;
    var tab1 = [];

    for (var k = 0; k < tab.length; k++){
        tab1.push(tab[k][col]);
    }

    sum = compterPoint(tab1);

    if (sum != 0){
        return colHTML.innerHTML = sum+"";
    }
    return colHTML.innerHTML = "";
};

/*Fonction sert a calculer le pointage Poker d'un tab de carte
(soit horizontale ou verticale)
Parametre :
- tab : tab de carte a calculer (1 ligne ou une colonne)
*/
var compterPoint = function (tab){

    var tab = trierTab(tab);
    var sum = 0;

    var compteurValeur = carteValeur(tab);
    var compteurCouleur = carteCouleur(tab);
    var carteSerie = serieCarte(tab);

    if (compteurValeur == 1){ // 1 pair
        return sum = 2;
    } else if (compteurValeur == 2){ //2pair
        return sum = 5;
    } else if (compteurValeur == 3){ //un triple
        return sum = 10;
    } else if (compteurValeur == 6){ // un carre
        return sum = 50;
    } else if (compteurValeur == 4){ //un triple et un pair
        return sum = 25;
    } else if (compteurCouleur == 1
               && carteSerie == 2){ //serie Quinte Flush Royal
        return sum = 100;
    } else if (compteurCouleur == 1 && carteSerie == 1){ //serie Quinte Flush
        return sum = 75;
    } else if (compteurCouleur == 1 && carteSerie == 0){ //serie Flush
        return sum = 20;
    } else if (compteurCouleur == 0
               && (carteSerie == 1 || carteSerie == 2)){ //serie Quinte
        return sum = 15;
    } else return sum;
};

/*Fonction pour trier un tab en ordre croissant
Parametre :
- tab : tableau a trier
*/
var trierTab = function (tab){
    if (tab.length >0){
    var tab1= [];
    for(var i = 0; i <tab.length; i++){
            if (tab[i] != 52){
        tab1.push(tab[i]);
            }
    }
    return tab1.sort(function(a,b){return a-b;});
    } else return -1;
};

/*Fonction pour evaluer les pairs, les triples ou carre
Parametre :
- tab : tableau carte a evaluer (1 range ou 1 colonne)
*/
var carteValeur = function (tab){
    var total = 0;
    var tabValeur=[];

    //tabValeur contient des valeurs >>2 de tab origine
    for (var j = 0 ; j <tab.length; j++){
        tabValeur.push(tab[j]>>2);
    }

    for (var m = 0; m < tabValeur.length; m++){
        var pos = tabValeur[m];
        for (var n = m+1; n< tabValeur.length; n++){
            if( pos == tabValeur[n]){
                total++;
            }
        }
    } return total;
};

/*Fonction pour evaluer si les cartes ont meme couleur
Parametre :
- tab : tableau de carte a evaluer (1 range ou 1 colonne)
*/
var carteCouleur = function(tab){
    if (tab.length == 5){
    var tabCouleur =[];

    //tabCouleur contient des valeurs &2 de tab origine
    for (var i = 0 ; i <tab.length; i++){
            tabCouleur.push(tab[i]&3);
    }

        for (var k = 0; k < tabCouleur.length; k++){
            var pos = tabCouleur[k];
            for (var j = k+1; j< tabCouleur.length; j++){
                if( pos != tabCouleur[j]){
                    return false;
                }
            }
        } return true;
    } else return false;
};

/*Fonction pour evaluer une serie de carte
Parametre :
- tab : tableau a evaluer (1 range ou 1 colonne)
*/
var serieCarte = function(tab){

    if (tab.length == 5){
    var tabValeur=[];
    var diff;

    //tabValeur contient des valeurs >>2 de tab origine
    for (var j = 0 ; j <tab.length; j++){
            tabValeur.push(tab[j]>>2);
    }

        diff = tabValeur[1]-tabValeur[0];

        if (diff == 9){ // Quinte Flush Royal ou Flush avec 10-J-Q-K-As
            for (var k = 2; k < tabValeur.length; k++){
                var b = tabValeur[k]-tabValeur[k-1];
                if (b != 1){
                    return 0;
                }
            } return 2;
        } else if (diff == 1){ // Quinte
            for (var j = 2; j <tabValeur.length ;j++){
                if (tabValeur[j]-tabValeur[j-1] != 1){
                    return 0;
                }
            } return 1;
        } else return 0;
    } return 0;
};


/*Fonction sert a chercher le index range de valeur "id"
Parametre :
-tab : tabGrilleFix -> pour positionner
-id : valeur a chercher index
*/
var indexRange = function(tab,id){
    var j;

    for (var a = 0;a <tab.length;a++){
        if(tab[a].indexOf(+id) != -1){
            j = a;
            break;
        }
    }
    return j;
};

/*Fonction sert a chercher le index colonne de valeur "id"
Parametre :
-tab : tabGrilleFix -> pour positionner
-id : valeur a chercher index
*/
var indexCol = function(tab,id){
    var i;

    for (var a=0 ;a <tab.length;a++){
        if(tab[a].indexOf(+id) != -1){
                i = tab[a].indexOf(+id);
            break;
        }
    }
    return i;
};

/*Fonction sert a chercher le index de image carte dans tab Carte
Parametre :
-tab : tabImage -> pour positionner
-card : image carte a chercher index
*/
var indexImage = function(tab,card){
    var i;

    for (var a=0 ;a <tab.length;a++){
        if(tab[a].indexOf(card) != -1){
                i = tab.indexOf(card);
            break;
        }
    }
    return i;
};


//---------------------------------------Partie HTML---------------------------

/*Fonction sert a genere un tableau sur la page html
Parametre :
-tab : tab a afficher sur la page html
*/
var genereTableau = function(tab){

    if(tab.length>0){
        var htmltable = "";

        for(var x=0; x < tab.length ; x++ ){

            htmltable = htmltable + "<tr>";
            for(var i = 0; i < tab[x].length; i++){

                htmltable = htmltable+ "<td id =\""+tab[x][i]
                            +"\" onclick = \"clic(id)\">"
                            + carteVide;
            }
            htmltable=htmltable +"<td id = \"R" + x + "\"></tr><tr>";
        } for (var k = 0; k < tab[0].length; k++){

            htmltable = htmltable + '<td id = "C'+k+'"></td>';
        }
        htmltable = htmltable + "<td id = \"T\" >"+0+"</td></tr>";

        return htmltable;
    } else {
        console.log("Le résultat retourné est vide.");
    }
};

/*Fonction pour changer couleur d'une case quand clic
Parametre :
-id : identificateur de page html (id de case clique)
*/
var changeCouleur = function (id){
    var a =  document.getElementById(id);

    if (a.style.backgroundColor  == "" ||
        a.style.backgroundColor == "transparent"){

        a.style.backgroundColor = "lime";

    } else if (a.style.backgroundColor == "lime"){
        a.style.backgroundColor = "transparent";
    }
};

/*Fonction sert a changer la place 2 cartes
Parametre :
-id : identificateur de la case actuelle
-cardPresent : image de la case actuelle
-iden : identificateur de la case precedente
-card : image de la case precedente
*/
var echangePos = function (id,cardPresent,iden,card){

    document.getElementById(id).innerHTML = card;
    document.getElementById(iden).innerHTML = cardPresent;
    document.getElementById(iden).style.backgroundColor = "transparent";
    document.getElementById(id).style.backgroundColor = "transparent";
};

/*Fonction pour determiner si le jeu est termine ou pas
Parametre :
-tab : tabGrilleFix - pour evaluer si tous les cases sont bien remplies
*/
var termineJeu = function(tab){

    for (var i = 0; i < tab.length; i++){
        candidat:
        for(var k = 0; k < tab[i].length; k++){
            if (document.getElementById(""+tab[i][k]).innerHTML != carteVide){
                continue candidat;
            } else { return false; }
        }
    }
    return true;
};

//------------------------------------------------------------------------------

// Fonction construit la page html quand la page est load
var init = function () {
    var tabCarte = fillTable(52,1,0); //tab contient 0,1,2,.. - cartes numerises

    tabCarteMelange = melangeCarte(tabCarte);
    tabJeu = fillMat(5,5,0,52); //[[52,52,52,52,52],...,[52,52,52,52,52]]
    tabGrilleFix = fillMat(5,5,1,5); //[[0,1,2,3,4],...,[20,21,22,23,24]]

    //partie construit la page html
    document.getElementById("b").innerHTML = "\<table>\
    <tr>\
       <td><button onclick=\"init()\">Nouvelle partie</button></td>\
       <td></td>\
       <td onclick = \"clic(id)\" id=\"53\">"+carteDos+"</td>\
       <td></td>\
    </tr>\
    </table>\
    <table>"+ genereTableau(tabGrilleFix) + "</table>";

};


/*Fonction pour chaque clic sur la case de la page html
Parametre :
- id : identificateur de la case clique
*/
var clic = function (id) {
    var a = document.getElementById(id);
    var b = document.getElementById(iden);
    var deck = document.getElementById("53");

    if (termineJeu(tabGrilleFix) == 0) {

        if ( id == "53"){ //quand tire carte

            changeCouleur(id);

            if ( a.innerHTML == carteDos){ //quand on tire une carte dans deck

                cardID = tabCarteMelange[tabCarteMelange.length-1];

                var i = tabCarteMelange.length-1;
                a.innerHTML = tabImage[tabCarteMelange[i]];
                tabCarteMelange = tabCarteMelange.slice(0,i);

                //au cas ou on clique sur une carte et on revient au paquet
                if (card != carteVide){
                    b.style.backgroundColor = "transparent";
                }

                card = a.innerHTML;
                iden = id;

            } else if (a.innerHTML != carteDos){
        //quand on revient a la carte ouverte sur le deck

                if (iden != "53") {
            b.style.backgroundColor = "transparent";
                }

        card = a.innerHTML;
                cardID = indexImage(tabImage,card);
                iden = id;
            }

        } else if (a.innerHTML == carteVide){ //quand click sur case vide

            //quand ajoute carte de paquet a une case vide
            if (document.getElementById("53").style.backgroundColor == "lime"){
                a.innerHTML = card;
                document.getElementById("53").innerHTML = carteDos;
                deck.style.backgroundColor = "transparent";
                card = carteVide;

                totalPoint(cardID,id);

                totalJeu(); //affiche point sur html


            } else if (card != carteVide && iden != "53"){
                //quand deplace une carte a une case vide
                cardID = indexImage(tabImage,card);

                echangePos(id,carteVide,iden,card);//affichage html

                totalPoint(cardID,id); //calcul case actuelle
                totalPoint(52,iden); //calcul case precedente

                totalJeu();//affiche point sur html

                card = carteVide;

            } else if (deck.style.backgroundColor == "transparent"){
                //quand clic sur case vide et aucun carte est active

                a.innerHTML = carteVide;
                a.style.backgroundColor = "transparent";

            }
        } else { //quand clic sur une carte

            changeCouleur(id);

            if (iden == "53"){ //quand ouvre carte mais laisser sur le paquet
                               //et deplace autres carte dans le jeu

                deck.style.backgroundColor = "transparent";
                card = a.innerHTML;
                iden = id;

            } else if (card == carteVide) { //quand choisi une carte

                card = a.innerHTML;
                iden = id;

            } else if (card != carteVide) {
                //quand echange de place de 2 cartes.

                cardPresent = a.innerHTML;
                cardID = indexImage(tabImage,cardPresent);
                cardIdPrec = indexImage(tabImage,card);

                echangePos(id,cardPresent,iden,card); //affichage html

                if ( id != "53"){
                    totalPoint(cardID,iden); // carte presente ->precedent
                    totalPoint(cardIdPrec,id); //carte precedent -> presente

                    totalJeu();
                }
                card = carteVide;
            }
        }
    } else { //quand le jeu est termine
        alert("Le jeu est termine! Votre pointage est "+ totalPoker);
        init();
    }
};

var testJeu = function (){
    if(compterPoint([0,1,6,9,30]) != "2") {//pairs d'as
    console.log("err");
    }

    if(compterPoint([33,35,52,52,52]) != "2"){//pairs de 9
    console.log("err");
    }

    if(compterPoint([13,14,6,5,53]) != "5"){//pairs de 4 et 2
    console.log("err");
    }

    if(compterPoint([49,50,24,25,52]) != "5"){//pairs de king et de 7
    console.log("err");
    }

    if(compterPoint([10,9,8]) != "10"){//brelan
    console.log("err");
    }

    if(compterPoint([33,34,32]) != "10"){//brelan
    console.log("err");
    }

    if(compterPoint([44,47,46,45]) != "50"){//Carre
    console.log("err");
    }

    if(compterPoint([20,23,21,22]) != "50"){//carre
    console.log("err");
    }

    if(compterPoint([33,21,34,22,32]) != "25"){//FullHouse
    console.log("err");
    }

    if(compterPoint([28,29,30,44,45]) != "25"){//FullHouse
    console.log("err");
    }

    if(compterPoint([39,34,29,41,44]) != "15"){//Quinte
    console.log("err");
    }

    if(compterPoint([2,5,11,13,16]) != "15"){//Quinte
    console.log("err");
    }

    if(compterPoint([6,22,30,42,50]) != "20"){//couleur
    console.log("err");
    }

    if(compterPoint([29,21,1,37,33]) != "20"){//couleur
    console.log("err");
    }

    if(compterPoint([0,4,8,12,16]) != "75"){//Quinte Flush
    console.log("err");
    }

    if(compterPoint([19,23,27,31,35]) != "75"){//Quinte Flush
    console.log("err");
    }

    if(compterPoint([3,51,47,43,39]) != "100"){//Quinte Flush Royal
    console.log("err");
    }

    if(compterPoint([2,38,42,46,50]) != "100"){//Quinte Flush Royal
    console.log("err");
    }

    if(trierTab([10,3,6])[0] != 3){ //trie et elimnie les "52"
    console.log("err");
    }

    if(trierTab([10,3,6,52,52]).length != 3){ //trie et elimnie les "52"
    console.log("err");
    }

    if(trierTab([]) != -1){
    console.log("err");
    }

    if(carteValeur([0,4,9,13,18]) != 0){ //0 pair
    console.log("err");
    }

    if(carteValeur([0,1,7,10,12]) != 1){ //1 pair
    console.log("err");
    }

    if(carteValeur([0,1,8,9,12]) != 2){ //2 pairs
    console.log("err");
    }

    if(carteValeur([0,1,3,10,12]) != 3){ //1 triple
    console.log("err");
    }

    if(carteValeur([0,1,2,12,13]) != 4){ //1 pair et 1 triple
    console.log("err");
    }

    if(carteValeur([0,1,2,3]) != 6){ //carre
    console.log("err");
    }

    if(carteCouleur([0,4,8,12,16]) != 1){ // meme couleur
    console.log("err");
    }

    if(carteCouleur([0,36,40,44,48]) != 1){ // meme couleur : 10-J-Q-K-As
    console.log("err");
    }

    if(carteCouleur([0,4,8,12,13]) != 0){ // pas meme couleur
    console.log("err");
    }

    if(serieCarte([0,5,10,12,19]) != 1){ // 1 serie
    console.log("err");
    }

    if(serieCarte([0,37,42,45,50]) != 2){ // 1 serie 10-J-Q-K-As
    console.log("err");
    }

    if(serieCarte([0,5,10,12,25]) != 0){ // 0 serie
    console.log("err");
    }

    if(indexRange([[0,1],[2,3]],0) != 0){ //index range de valeur 0
    console.log("err");
    }

    if(indexCol([[0,1],[2,3]],3) != 1){ //index colonne de valeur 3
    console.log("err");
    }

    if(tabImage[0] != "<img src=\"cards/AC.svg\">"){//genere image dans tabImage
    console.log("err");
    }

    if(tabImage[26] != "<img src=\"cards/7H.svg\">"){
    console.log("err");
    }

    if(tabImage[36] != "<img src=\"cards/10C.svg\">"){
    console.log("err");
    }

    if(tabImage[51] != "<img src=\"cards/KS.svg\">"){
    console.log("err");
    }

     //cherche index un image
    if(indexImage(tabImage,"<img src=\"cards/AC.svg\">") != 0){
    console.log("err");
    }

    if(indexImage(tabImage,"<img src=\"cards/7H.svg\">") != 26){
    console.log("err");
    }

    if(indexImage(tabImage,"<img src=\"cards/10C.svg\">") != 36){
    console.log("err");
    }

    if(indexImage(tabImage,"<img src=\"cards/KS.svg\">") != 51){
    console.log("err");
    }
};

testJeu();
