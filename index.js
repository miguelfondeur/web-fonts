'use strict'

//Imports
import { fonts } from './font-data.js';

//Elements
const cardWrapper = document.getElementById('card-wrapper');

//Loop throught font Data
fonts.forEach( font => {
    let cardDisabled = !document.fonts.check(`12px ${font.declaration}`);

    const html = `
        <button class="card" disabled="${cardDisabled}">
            <div class="card-top">
                <h3>${ font.name }</h3>
                <p>${ font.weights.length } Styles</p>
            </div>
            <p class="text-example" style="font-family: ${ font.declaration };">The quick brown fox jumps over a lazy dog</p>
        </button>
    `;
    cardWrapper.insertAdjacentHTML('beforeEnd', html )
})