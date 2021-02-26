/**
 * Sneaker Guide Tabs Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class SimpleGlideSection extends AbstractComponent {
    constructor(component) {
        super(component);
        
        new Glide('.glide1').mount()

    }

}
