/* =============================================================================================================
 * $Id: //NetMenu/branch-10.10.100.6234/Application/NetNutritionMVC/Scripts/CBORD_NN_UI.js#1 $
 * Created On:   01/01/2011
 * $Revision: #1 $
 * $DateTime: 2014/05/06 16:54:23 $
 * =============================================================================================================
 */

// global var for the please wait div contents (filled in by script on render of main page w/ proper language)
var PLEASE_WAIT_HTML;

// create the HTML for the please wait div based on given parms
function makePleaseWait(divClass, imgSrc, textClass, text)
{
	PLEASE_WAIT_HTML = '<div id="nn_PleaseWait" class="';
	PLEASE_WAIT_HTML += divClass;
	PLEASE_WAIT_HTML += '"><table><tr><td><img alt="Please Wait" src="';
	PLEASE_WAIT_HTML += imgSrc;
	PLEASE_WAIT_HTML += '"/></td><td><span class="';
	PLEASE_WAIT_HTML += textClass;
	PLEASE_WAIT_HTML += '>"';
	PLEASE_WAIT_HTML += text;
	PLEASE_WAIT_HTML += '</span></td></tr></table></div>';
}

 // display a panel w/ new contents and erase the other panels
 function erasePanels(toErase)
 {
    if (toErase)
    {
        for (var i = 0; i< toErase.length; i++)
        {
           erasePanel(toErase[i]);
        }
    }
 }

 // erase a panel 
 function erasePanel(id)
 {
    $('#'+id).html('');
 }

// handle the re-rendering of a div's contents and general error conditions for any post call
// id is the id of the div or null if nothing to be rendered (e.g. portion change)
// note: can get an entire page for data, which means we've had a session timeout or error: time to start over.
function postCb(id, data)
{
    // might not get a string from a $post, so be careful here
    if (typeof data != "string")
    {
    	// get out now as we returned a non-string (most likely an empty rendering)
    	return;
    }
	
    // if NOT the whole page, render the panel if given
    var htmlPos = data.indexOf("<html");
    if (htmlPos == -1)
    {
        // no 'html' tag, so render the div (if we have one), but ignore 'null' renderings
        if (id && data.length > 0)
        {
        	$('#' + id).html(data);
        }
    }
    else
    {
    	// this should "refresh" the page
    	window.location.reload(true);
    }
}

// NetNutrition navigation and client-side functions
// enabling/disabling buttons based on checks
var MENU_PORTION_PREFIX = 'pcm';
var MENU_CHECKBOX_PREFIX = 'cbm';

// enable/disable buttons based on whether elements are selected (checkboxed)
function menuDetailGridCb(cbElem, oid)
{
    // enable/disable Nutrition label, add to my meals, and other buttons based on collective checkbox state
    var checkedItems = (($('input[id^= "' + MENU_CHECKBOX_PREFIX + '"]:checked').length) > 0);
    var disabledVal = !(checkedItems);
    setMenuItemButtonsDisabledState(disabledVal);

    // send new state of this checkbox back to session state (render any errors w/ null id)
    var url = makeURL("Menu", "SelectItem");
    $.post(url, { detailOid: oid }, function (data) { renderResponse(data); });
}

// set the enabled status of the Nutrition Label and 'add to my meals' buttons
// 'disabledVal' should be a boolean (true/false)
function setMenuItemButtonsDisabledState(disabledVal)
{
    $('#detail1').prop("disabled", disabledVal);
    $('#detail2').prop('disabled', disabledVal);
    $('#add1').prop('disabled', disabledVal);
    $('#add2').prop('disabled', disabledVal);
}

// onchange event from a portion SSLB: send oid and new amount
function portionChange(selectElem, oid)
{
	var amt = selectElem.options[selectElem.selectedIndex].value;
    // send new amount; render any errors
	var url = makeURL("Menu", "ChangePortion");
	$.post(url, { detailOid: oid, amount: amt }, function (data) { renderResponse(data); });
}

// onchange event from a uofm SSLB: send oid and new uofm
function setSelectedUofM(selectElem, oid)
{
	var uofmOid = selectElem.options[selectElem.selectedIndex].value;
    // send new uofm; render any errors
	var url = makeURL("Menu", "ChangeUofM");
	$.post(url, { detailOid: oid, uofmOid: uofmOid }, function (data) { renderResponse(data); });
}

// shared helper function to update the nav bar if it is in use
function UpdateNavBar(useNavBar, disableBtn)
{
	if (useNavBar)
	{
		var url2 = makeURL("MyMeals", "UpdateNavBar");
		$.post(url2, null, function (data) { updateMyMealCount(data); });
		// will be ignored if button was not rendered
		$("#openMyMeal").prop('disabled', disableBtn);
	}	
}

// Add the selected item(s) to "my meal" (response includes a new rendering of the items to clear the checkboxes)
function addToMyMeals(useNavBar)
{
	var form = Get_NN_Form();
	var url = makeURL("MyMeals", "AddToMyMeal");
	$.post(url, form.serialize(), function (jSonData) { renderResponse(jSonData); });
	UpdateNavBar(useNavBar, false);
}

// Render the labels for the item on mouseover
function getMyMealNutritionLabel(oid, unitOid, uofmOid) 
{
    var topPos = getScrollPos();
    $('#nutritionLabelPanel').css({ "top": topPos });
    var url = makeURL("NutritionDetail", "ShowMyMealNutritionLabel");
    $.post(url, { detailOid: oid, unitOid: unitOid, uofmOid: uofmOid }, function (data) { $('#nutritionLabelPanel').html(data); });    
}

// Render the labels for the item on mouseover
function getItemNutritionLabel(oid) 
{
    var topPos = getScrollPos();
    $('#nutritionLabelPanel').css({ "top": topPos });
    var url = makeURL("NutritionDetail", "ShowItemNutritionLabel");
    $.post(url, { detailOid: oid }, function (data) { postCb('nutritionLabelPanel', data); });
}

// Render the nutrition grid for the selected items in the current menu
function getItemNutritionGrid()
{
    closeNutritionDetailPanel();
    var topPos = getScrollPos();
    $('#nutritionGridPanel').css({ "top": topPos });
    var url = makeURL("NutritionDetail", "ShowMenuDetailNutritionGrid");
    $.post(url, null, function (data) { postCb('nutritionGridPanel', data); });
}

// render the nutrtion grid for the items in my meal
function getMyMealSummaryNutrition()
{
    closeNutritionDetailPanel(); 
    var topPos = getScrollPos();
    $('#nutritionGridPanel').css({ "top": topPos });
    var url = makeURL("NutritionDetail", "ShowMyMealSummaryNutritionGrid");
    $.post(url, null, function (data) { postCb('nutritionGridPanel', data); });
}

// close the nutritiongrid
function closeNutritionGrid()
{
    erasePanel('nutritionGrid');
    var url = makeURL("NutritionDetail", "CloseItemNutritionGrid");
	// close action returns nothing; render errors as needed
    $.post(url, null, function (data) { renderResponse(data); });
}

// close the nutrition label
function closeNutritionDetailPanel() 
{
    erasePanel('nutritionLabel');
}

// open my meal panel
function showMyMeals()
{
    erasePanel('nutritionGrid');
    var url = makeURL("MyMeals", "MyMealList");
    $.post(url, null, function (data) { postCb('myMealPanel', data); });
}

// close the my meal panel (used when it is a floating panel)
function closeMyMealPanel()
{
    erasePanel('myMealPanel');
}

// open traits panel
function showTraits()
{
    erasePanel('traitsPanel');
    var url = makeURL("Trait", "TraitList");
    $.post(url, null, function (data) { postCb('traitsPanel', data); });
}

// close the traits panel
function closeTraitsPanel()
{
    erasePanel('traitsPanel');
}

// open the nutrition grid 'printer friendly' window
function openNutritionPrintGrid()
{
	var url = makeURL("NutritionDetail", "ShowItemNutritionPrintGrid");
	var w = window.open(url, 'NutritionPrintGrid', 'left=20,top=20,width=850,height=600,toolbar=1,resizable=1,menubar=1,scrollbars=1');
	if (!w)
	{
		alert("could not open: " + url);
		return;
	}
	w.focus();
}

// remove the given detail from my meal
function myMealRemove(oid, unitOid, uofmOid, useNavBar, isEmpty)
{
	var url = makeURL("MyMeals", "RemoveItem");
	$.post(url, { detailOid: oid, unitOid: unitOid, uofmOid: uofmOid }, function (data) { postCb('myMeal', data); });
	UpdateNavBar(useNavBar, isEmpty);
}

// update the count in the navigation header
function updateMyMealCount(contents)
{
    $("#myMealCount").html(contents);
}

// change the portion for an item in my meal.
function myMealPortionChange(selectElem, unitOid, oid, uofmOid)
{
	var amt = selectElem.options[selectElem.selectedIndex].value;
    // send new amount; render any errors
	var url = makeURL("MyMeals", "ChangePortion");
	$.post(url, { unitOid: unitOid, detailOid: oid, uofmOid: uofmOid, amount: amt }, function (data) { renderResponse(data); });
}

// clear the contents of "my meal"
function clearMyMeals(useNavBar)
{
    // note: the session state will clear the current menu checkboxes (if there are any)
	var url = makeURL("MyMeals", "ClearMyMeal");
	$.post(url, null, function (data) { postCb('myMeal', data); });
	UpdateNavBar(useNavBar, true);

    // this does all the booking in the browser (an alternative is to re-render the entiere page)
    if (isPanelDisplayed('itemPanel'))
    {
        // disable all the buttons
        setMenuItemButtonsDisabledState(true);

        // clear all the checkboxes and the corresponding portion ddlbs
        $('input[id^= "' + MENU_CHECKBOX_PREFIX + '"]:checked').each(function ()
        {
            this.checked = false;
        });
    }
}

// is the given panel div currently displayed?
function isPanelDisplayed(panelDivId)
{
    // if the item panel exists and is not empty, then it's open and displayed
    if ($('#' + panelDivId).length > 0)
    {
        if ($('#' + panelDivId).html().length != 0)
        {
            return true;
        }
    }
    return false;
}

// onclick for a trait checkbox
function traitListCb(cbElem, oid)
{
    // toggle this checkbox back in session state
    var menuOpen = isPanelDisplayed('itemPanel');
    // if the item panel exists and is not empty refresh it
    var url = makeURL("Menu", "SelectTrait");
    $.post(url, { detailOid: oid, menuOpen: menuOpen }, function (jSonData) { renderResponse(jSonData); });
}

// clear all filters so that all menu items will be shown
function clearFilters()
{
    $('input[id^=allergy]').attr('checked', false);
    $('input[id^=pref]').attr('checked', false);

    var menuOpen = isPanelDisplayed('itemPanel');
    var url = makeURL("Menu", "ClearFilters");
    $.post(url, { menuOpen: menuOpen }, function (jSonData) { renderResponse(jSonData); });
}

// handle a course selection: render the corresponding menu details
function selectCourse(courseOid)
{
    $("#itemPanel").html(PLEASE_WAIT_HTML);
    var url = makeURL("Menu", "SelectCourse");
    $.post(url, { oid: courseOid }, function (jSonData) { renderResponse(jSonData); });
}

// handle a goal radio button click
function selectGoal(radioBtn)
{
	// normal return value for 'date' is null; on error we sometimes get the entire page, so keep the render call
	var url = makeURL("NutritionGoals", "SelectGoal");
	$.post(url, { oid: radioBtn.value }, function (data) { renderResponse(data); });
}

// handle a menu selection click from the menu list panel
function menuListSelectMenu(menuOid)
{
    $("#itemPanel").html(PLEASE_WAIT_HTML);
    var url = makeURL("Menu", "SelectMenu");
    $.post(url, { menuOid: menuOid }, function (jSonData) { renderResponse(jSonData); });  
}

// handle a 'back' button click from the menu list panel
function menuListBackBtn()
{
	var url = makeURL("Menu", "GoBackFromMenuList");
	$.post(url, null, function (jSonData) { renderResponse(jSonData); });
}

// handle a 'back' button click from the menu detail panel
function menuDetailBackBtn()
{
	var url = makeURL("Menu", "GoBackFromMenuDetails");
	$.post(url, null, function (jSonData) { renderResponse(jSonData); });
}

// handle a 'back' button click from the courses panel
function courseListBackBtn()
{
	var url = makeURL("Menu", "GoBackFromCourseList");
	$.post(url, null, function (jSonData) { renderResponse(jSonData); });
}

// handle a link click from the unit tree
function unitTreeSelectUnit(unitOid)
{
    $("#itemPanel").html(PLEASE_WAIT_HTML);
    var url = makeURL("Unit", "SelectUnitFromTree");
    $.post(url, { unitOid: unitOid }, function (jSonData) { renderResponse(jSonData); });
}

// handle a link click in the unit side bar navigation panel
function sideBarSelectUnit(unitOid)
{
    $("#itemPanel").html(PLEASE_WAIT_HTML);
    var url = makeURL("Unit", "SelectUnitFromSideBar");
    $.post(url, { unitOid: unitOid }, function (jSonData) { renderResponse(jSonData); });
}

// handle a link click in the child list panel
function childUnitsSelectUnit(unitOid)
{
    $("#itemPanel").html(PLEASE_WAIT_HTML);
    var url = makeURL("Unit", "SelectUnitFromChildUnitsList");
    $.post(url, { unitOid: unitOid }, function (jSonData) { renderResponse(jSonData); });
}

// handle a back button click in the child list panel
function childUnitBackBtn()
{
	var url = makeURL("Unit", "GoBackFromChildList");
	$.post(url, null, function (jSonData) { renderResponse(jSonData); });
}

// handle a back button click in the unit list panel
function unitBackBtn()
{
	var url = makeURL("Unit", "GoBackFromUnitList");
	$.post(url, null, function (jSonData) { renderResponse(jSonData); });
}

// hanle a link click in the units panel
function unitsSelectUnit(unitOid)
{
    $("#itemPanel").html(PLEASE_WAIT_HTML);
    var url = makeURL("Unit", "SelectUnitFromUnitsList");
    $.post(url, { unitOid: unitOid }, function (jSonData) { renderResponse(jSonData); });
}

// expand and collapse control for tree list
function setUnitTreeUnitState(unitOid)
{
	// should return the HTML for the side unit panel 
	var url = makeURL("Unit", "SetUnitTreeUnitState");
	$.post(url, { unitOid: unitOid }, function (data) { postCb('sideUnitPanel', data); });
}

// render a post-back json response that may contain multiple panel renderings + success/failure
function renderResponse(data)
{
    try
    {
        if (data)
        {
            if (data.success)
            {
            	var panelArray = data.panels;
                for (var index = 0; index < panelArray.length; index++)
                {
                	var keyPair = panelArray[index];
	                var html = keyPair.html;
                	if (html.length == 0)
                	{
                		erasePanel(keyPair.id);
                	}
                	else
                	{
                		postCb(keyPair.id, html);
                	}
                }
            }
            else 
            { 
                //catch bad post back after session timeout
                if (typeof data.errorID === "undefined")
                {
	                // for bad errors (usually a rendering of the 'stop' page), just refresh
                	window.location.reload(true);
                }
                else 
                {
                    // always erase the item panel because the "wait" gif goes there.
                    erasePanel("itemPanel");
                    postCb(data.errorID, data.errorHTML);
                }                
            }
        }
    }
    catch (e)
    {
        alert("Exception: " + e.Message);
    }
}

// create a URL for posting (or window.open) given the controller and action; assumes external ID is part of URL as it must be.
function makeURL(controller, action)
{
	var path = window.location.pathname;
	if (path[path.length - 1] != '/')
	{
		path += '/';
	}
	return path + controller + '/' + action;
}

// render the given static panel
function openStaticPanel(panelId, toErase)
{
	erasePanels(toErase);
	var url = makeURL("Home", "OpenStaticPanel");
    $.post(url, { PanelID: panelId }, function (data) { postCb(panelId, data); });
}

// Close error panel
function closeErrorPanel()
{
    erasePanel('errorPanel');
}

// if a rendering error occurs, refresh session and start over.
function repositionAfterError()
{
	var url = makeURL("Home", "StartOver");
	$.post(url, null, function (ignoredData) { });
	// refresh our entire page after a 'start over'
	window.location.reload(true);
}

// return the main form. 
function Get_NN_Form() 
{
    var formToUse = $('#cbo_nn_Form');
    return formToUse;
}

// return the current scroll position (for as many browsers as possible)
function getScrollPos()
{
    var scrollTop = document.body.scrollTop;
    if (scrollTop == null || scrollTop == 0)
    {
	    if (window.pageYOffset)
	    {
		    scrollTop = window.pageYOffset;
	    }
	    else
	    {
	    	scrollTop = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;  
	    } 
    }
    // If we can't find the scroll position set it to 0 
    if (scrollTop == null)
    {
        return 0;
    }
    return scrollTop;
}

// handle the result of changing culture: should be empty string for all OK or error message (for an alert); always just refresh the entire page
function ChangeCultureCb(cultureName, data)
{
	if (data && data.length > 0)
	{
		// on sesssion timeout, we end up the the entire page here, so do not show an alert (just refresh)
		var htmlPos = data.indexOf("<html");
		if (htmlPos == -1)
		{
			alert(data);
		}
		else
		{
			// detect proper functioning via known CSS class
			var pageCssPos = data.indexOf("cbo_nn_page");
			if (pageCssPos == -1)
			{
				alert("Service unavailable");
			}
			else
			{
				// now that the session has restarted, try again
				ChangeCulture(cultureName);
				return;
			}
		}
	}
	window.location.reload(true);	
}

// action to change culture to the given value. 
function ChangeCulture(cultureName)
{
	var url = makeURL("Home", "ChangeCultureOnThread");
	$.post(url, { cultureName: cultureName }, function (data) { ChangeCultureCb(cultureName, data); });
}