/**
 * Section Features Section Script
 * ------------------------------------------------------------------------------
 *
 */

 import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class SectionFeaturesSection extends AbstractComponent{
    constructor(component) {
        super(component);

        this.initNav();

        var glider_shoe = new Glide('#g_shoe1');
        glider_shoe.mount();
        var glider_shoe2 = new Glide('#g_shoe2');
        glider_shoe2.mount();
        var glider_shoe3 = new Glide('#g_shoe3');
        glider_shoe3.mount();
        var glider_shoe4 = new Glide('#g_shoe4');
        glider_shoe4.mount();
    }

    initNav() {
        this.tablinks = this.component.querySelectorAll(".tablink");
        var i;
        for (i = 0; i < this.tablinks.length; i++) {
            this.tablinks[i].onclick = function(e) {
                var i, tabcontent, tablinks;
                tabcontent = document.getElementsByClassName("tabcontent");
                for (i = 0; i < tabcontent.length; i++) {
                    tabcontent[i].style.display = "none";
                }
                // tablinks = document.getElementsByClassName("overlay");
                // for (i = 0; i < tablinks.length; i++) {
                //     tablinks[i].style.backgroundColor = "#dddddd";
                // }
                if (e.srcElement.parentElement.id != '') {
                    document.getElementById(e.srcElement.parentElement.id+"_content").style.display = "block";
                    // document.getElementById(e.srcElement.parentElement.id+"_line").style.backgroundColor = "#000000";
                } else {
                    document.getElementById(e.srcElement.id+"_content").style.display = "block";
                    // document.getElementById(e.srcElement.id+"_line").style.backgroundColor = "#000000";
                }
                
                // new Glide('.glide').mount();
            };
        }
        document.getElementById(this.tablinks[0].id+"_content").style.display = "block";


        // console.log(this.tablinks);

        // this.tablinks[1].onclick = function() {
        //     console.log('another one bites the dust');
        // };

    }

}
