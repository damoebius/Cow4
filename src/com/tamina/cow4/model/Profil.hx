package com.tamina.cow4.model;

/**
* Le profil d'une IA
* @author d.mouton
* @class Profiln
*/
@:enum abstract Profil(Int) from Int to Int  {

/**
	 * Le scientifique
	 * @property TECH_WIZARD
	 * @type Int
	 * @default 0
	 * @static
	 * @readOnly
	 */
    var TECH_WIZARD=0;

/**
	 * Le financier
	 * @property MASTER_OF_COINS
	 * @type Int
	 * @default 1
	 * @static
	 * @readOnly
	 */
    var MASTER_OF_COINS=1;

/**
	 * Le commercial
	 * @property HAND_OF_THE_KING
	 * @type Int
	 * @default 2
	 * @static
	 * @readOnly
	 */
    var HAND_OF_THE_KING=2;

    var SHEEP=3;

}
