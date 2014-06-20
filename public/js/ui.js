jQuery(document).ready(function() {

//	jQuery("ul#countries li").click(function() {
//		jQuery(this).addClass("moveUp").prev().addClass("moveDown"); // Affecte la classe moveUp à l'élément qui gagne une place et fait descendre l'élément précédent
//		// La transition dure 200ms (peut être changée dans la CSS mais une transition rapide évitera les problèmes quand y'a bcp de changements simultanés).
//		// Il faut qu'au bout de ces 200ms, les deux li concernés perdent la classe moveUp ou moveDown et soit effectivement inversés dans le DOM
//	});

  jQuery("#addCampaign").click(function(){
    jQuery('#demo-instructions').removeClass('hidden');
  });

  jQuery("#campaignForm").click(function(){
    addCampaign();
  });

});

function addCampaign(){
  var critera = jQuery('#inputCampaignCriteria').val();
  var htmlString = jQuery('<li><div class="campaign">' + critera + '<img src="img/dismiss.png" alt="dismiss" class="close-x"></div></li>').appendTo("#campaignList");
  htmlString.click(function () {
    jQuery.ajax({
      type: 'POST',
      url: '/tweet-spam',
      data: { keyword: jQuery(this).text() }
    });
  });

  jQuery(".close-x", htmlString).click(function(e) {
    e.stopPropagation();
    jQuery(this).parent().remove();
  });

  jQuery('#demo-instructions').addClass('hidden');
  jQuery('#inputCampaignCriteria').val("");
}