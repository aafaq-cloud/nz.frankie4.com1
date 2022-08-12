/**
 * Section Features Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class HighHeelsDifference extends AbstractComponent{
    constructor(component) {
        super(component);

        var glider_shoe = new Glide('.glide');
        glider_shoe.mount();

    }

}
