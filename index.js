const corsUrl = 'https://cors-anywhere.herokuapp.com/'
const endUrl = 'https://api.coinranking.com/v2/coins'
const apiKey = 'coinranking5a3d7bbac412656f0ef30a0703ac16787cb93a6527737789'

function getCoins () {
   fetch(`${corsUrl}${endUrl}`, 
   {
    method: "GET",
    headers: {
      'x-access-token': apiKey,
      "Access-Control-Allow-Headers" : "Content-Type",
      'Content-Type' : 'application/json',
      'Access-Control-Allow-Origin' : '*',
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", 
      'origin' : "*"
    }
  })
  .then(response => response.json())
  .then(responseJSON => displayCoins(responseJSON));
}

function abbreviatemCap(value) {
  let newValue = value;
  const suffixes = ["", "K", "M", "B","T"];
  let suffixNum = 0;
  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  newValue = newValue.toPrecision(3);

  newValue += suffixes[suffixNum];
  return newValue;
}

function displayCoins(coins) {
  for(let i = 0; i < coins['data']['coins'].length; i++){
    const mCapAbbr = abbreviatemCap(coins['data']['coins'][i].marketCap)
    $('.container.card-wrapper').append(
      `<div class="container token-bar">
      <div class="container rank token-container">
        <span>${coins['data']['coins'][i].rank}</span>
        <div class="container icon-background">
          <div class="container icon-wrapper">
            <img src=${coins['data']['coins'][i].iconUrl} 
            alt=${coins['data']['coins'][i].name} 
            class="token-icon blur-fix icon-${i}">
          </div>
        </div>
      </div>
      <div class="container name token-container">
        <span>${coins['data']['coins'][i].name}</span>
      </div>
      <div class="container symbol token-container">
        <span>${coins['data']['coins'][i].symbol}</span>
      </div>
      <div class="container price token-container">
        <span>$${Math.round(coins['data']['coins'][i].price)}</span>
      </div>
      <div class="container percent token-container percDiv-${i}">
        <span>${coins['data']['coins'][i].change}%</span>
      </div>
      <div class="container mCap token-container">
        <span>${mCapAbbr}</span>
        <span class="media-drop drop-arrow"></span>
      </div>
    </div>
     <div class="container media-drop info-drop hide-dropdown del-dropdown media-drop-wrap content-disabled">
        <div class="info-drop info-con">
          <div class="info-body symbol-title">
            Symbol
            <div class="info-body symbol-body">
              <span>${coins['data']['coins'][i].symbol}</span>
            </div>
          </div>
          <div class="info-body price-title">
            Price
            <div class="info-body price-body">
              <span>$${Math.round(coins['data']['coins'][i].price)}</span>
            </div>
          </div>
            <div class="info-body percent-title">
              24h
              <div class="info-body percent-body percent-body-${i}">
                <span>${coins['data']['coins'][i].change}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    )

      if(coins['data']['coins'][i].change > '0') {
        $(`div.percDiv-${i}`).addClass('percentUp');
        $(`div.percDiv-${i}`).append('<span class="arrow-up">▲</span>');
        $(`div.percent-body-${i}`).addClass('percentUp');
        $(`div.percent-body-${i}`).append('<span class="arrow-up">▲</span>');
      } else if(coins['data']['coins'][i].change < '0' && coins['data']['coins'][i].change.includes('-')) {
        $(`div.percDiv-${i}`).addClass('percentDown');
        $(`div.percDiv-${i}`).append('<span class="arrow-down">▼</span>');
        $(`div.percent-body-${i}`).addClass('percentDown');
        $(`div.percent-body-${i}`).append('<span class="arrow-down">▼</span>');

      }

      if(coins['data']['coins'][i].name === 'Elrond' || 
      coins['data']['coins'][i].name === 'Algorand' || 
      coins['data']['coins'][i].name === 'Stellar' || 
      coins['data']['coins'][i].name === 'Wrapped BTC'){
        $(`img.icon-${i}`).removeClass('blur-fix');
         $(`img.icon-${i}`).addClass('contrast-fix');
      }  
      
      if(coins['data']['coins'][i].symbol === 'Internet Computer (DFINITY)') {
        $(`img.icon-${i}`).css('margin-bottom', '7px');
      }
  }

  monitorQueryDrop();
}



function monitorQueryDrop() {
if(window.innerWidth <= 429) {
  $('.container.token-bar').on('click', function() {
    $(this).find('.drop-arrow').toggleClass('span-arrow-flip');
    $(this).next('.container.media-drop').removeClass('del-dropdown');
    if($(this).next('.media-drop-wrap').hasClass('hide-dropdown')) {
      $(this).next('.media-drop-wrap').removeClass('hide-dropdown');
      $(this).next('.media-drop-wrap').next().addClass('show-dropdown');
      $(this).removeClass('border-true');
      $(this).addClass('border-false');
    } else {
      $(this).next('.container.media-drop').addClass('del-dropdown');
      $(this).next('.media-drop-wrap').removeClass('show-dropdown');
      $(this).removeClass('border-false');
      $(this).addClass('border-true');
      $(this).next('.media-drop-wrap').addClass('hide-dropdown');
    }
  }) 
} else {
  $('.container.media-drop').addClass('del-dropdown')
}
}

window.addEventListener('resize', monitorQueryDrop);

$(function() {
  getCoins();
}) 
