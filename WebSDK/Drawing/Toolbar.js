"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     27.11.14
 * Time     1:27
 */

function CDrawingToolbar(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control : null
    };

    this.m_oBColor = new CColor(217, 217, 217, 255);

    this.m_aControls = [];
    this.m_aDrawingControls = [];
}

CDrawingToolbar.prototype.Add_Control = function(oControl, nW, nSpace, eAlign)
{
    this.m_aDrawingControls.push(new CDrawingToolbarItem(oControl, nW, nSpace, eAlign));
};
CDrawingToolbar.prototype.Init = function(sDivId, oGameTree)
{
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var  oMainElement = this.HtmlElement.Control.HtmlElement;
    var  oMainControl = this.HtmlElement.Control;

    oMainElement.style.backgroundColor = this.m_oBColor.ToString();

    var nLeft  = 0;
    var nRight = 0;
    for (var nIndex = 0, nCount = this.m_aDrawingControls.length; nIndex < nCount; ++nIndex)
    {
        var oDrawingControl = this.m_aDrawingControls[nIndex];
        var oControl        = oDrawingControl.Get_Control();

        if (null !== oControl)
        {
            var sElementName = sDivId + nIndex;
            this.private_CreateDivElement(oMainElement, sElementName);

            if (EToolbarFloat.Left === oDrawingControl.Get_Align())
            {
                this.private_FillHtmlElement(oMainControl, sElementName, nLeft, oDrawingControl.Get_W(), true);
                nLeft += oDrawingControl.Get_W() + oDrawingControl.Get_Space();
            }
            else
            {
                this.private_FillHtmlElement(oMainControl, sElementName, nRight, oDrawingControl.Get_W(), false);
                nRight += oDrawingControl.Get_W() + oDrawingControl.Get_Space();
            }

            oControl.Init(sElementName, oGameTree);

            this.m_aControls.push(oControl);
        }
    }

    this.Update_Size();
};
CDrawingToolbar.prototype.Update_Size = function()
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    this.HtmlElement.Control.Resize(W, H);
    for (var Index = 0, Count = this.m_aControls.length; Index < Count; Index++)
    {
        this.m_aControls[Index].Update_Size();
    }
};
CDrawingToolbar.prototype.private_CreateDivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingToolbar.prototype.private_FillHtmlElement = function(oParentControl, sName, nDistance, nWidth, bLeftAlign)
{
    var oControl = CreateControlContainer(sName);

    if (bLeftAlign)
    {
        oControl.Bounds.SetParams(nDistance, 0, 0, 1000, true, false, false, false, nWidth, -1);
        oControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom);
    }
    else
    {
        oControl.Bounds.SetParams(0, 0, nDistance, 1000, false, false, true, false, nWidth, -1);
        oControl.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);
    }

    oParentControl.AddControl(oControl);
};

function CDrawingNavigatorCommentsTabs(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control   : null,
        Comments  : { Control : null },
        Navgiator : { Control : null }
    };

    this.m_oBColor = new CColor(217, 217, 217, 255);
    this.m_oNavigatorButton = null;
    this.m_oCommentsButton  = null;
    this.m_oNavigatorDiv    = null;
    this.m_oCommentsDiv     = null;

    this.m_aControls = [];
}
CDrawingNavigatorCommentsTabs.prototype.Init = function(sDivId, oGameTree, _sNavigatorDivId, _sCommentsDivId)
{
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var  oMainElement = this.HtmlElement.Control.HtmlElement;
    var  oMainControl = this.HtmlElement.Control;

    oMainElement.style.backgroundColor = this.m_oBColor.ToString();

    var oCommentsControl = new CDrawingButton(this.m_oDrawing);
    var sCommentsDivId = sDivId + "C";
    this.private_CreateDivElement(oMainElement, sCommentsDivId);
    this.private_FillHtmlElement(oMainControl, sCommentsDivId, 0, 0.5);
    oCommentsControl.Init(sCommentsDivId, oGameTree, EDrawingButtonType.TabComments);
    this.m_oCommentsButton = oCommentsControl;

    var oNavigatorControl = new CDrawingButton(this.m_oDrawing);
    var sNavigatorDivId = sDivId + "N";
    this.private_CreateDivElement(oMainElement, sNavigatorDivId);
    this.private_FillHtmlElement(oMainControl, sNavigatorDivId, 1, 1);
    oNavigatorControl.Init(sNavigatorDivId, oGameTree, EDrawingButtonType.TabNavigator);
    this.m_oNavigatorButton = oNavigatorControl;

    // TODO: Переделать здесь, когда классы с кнопками переделаются по нормальному
    this.m_oNavigatorButton.m_oParent = this;
    this.m_oCommentsButton.m_oParent  = this;
    this.m_oNavigatorDiv = document.getElementById(_sNavigatorDivId);
    this.m_oCommentsDiv  = document.getElementById(_sCommentsDivId);
    this.Select(this.m_oCommentsButton);

    this.Update_Size();
};
CDrawingNavigatorCommentsTabs.prototype.Update_Size = function()
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    this.HtmlElement.Control.Resize(W, H);
    this.m_oNavigatorButton.Update_Size();
    this.m_oCommentsButton.Update_Size();
};
CDrawingNavigatorCommentsTabs.prototype.private_CreateDivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingNavigatorCommentsTabs.prototype.private_FillHtmlElement = function(oParentControl, sName, nStart, nEnd)
{
    var oControl = CreateControlContainer(sName);
    oControl.Bounds.SetParams(0, nStart * 40, 1000, 0, false, true, false, false, -1, 40);
    oControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oParentControl.AddControl(oControl);
};
CDrawingNavigatorCommentsTabs.prototype.Select = function(oClass)
{
    if (oClass === this.m_oNavigatorButton)
    {
        this.m_oNavigatorButton.Set_Selected(true);
        this.m_oCommentsButton.Set_Selected(false);

        this.m_oNavigatorDiv.style.visibility = "visible";
        this.m_oCommentsDiv.style.visibility  = "hidden";
    }
    else if (oClass === this.m_oCommentsButton)
    {
        this.m_oNavigatorButton.Set_Selected(false);
        this.m_oCommentsButton.Set_Selected(true);

        this.m_oNavigatorDiv.style.visibility = "hidden";
        this.m_oCommentsDiv.style.visibility  = "visible";
    }
    else
    {
        this.m_oNavigatorButton.Set_Selected(false);
        this.m_oCommentsButton.Set_Selected(false);

        this.m_oNavigatorDiv.style.visibility = "hidden";
        this.m_oCommentsDiv.style.visibility  = "hidden";
    }
};

var EToolbarFloat =
{
    Left   : 1,
    Right  : 2
};

function CDrawingToolbarItem(oControl, nW, nSpace, eAlign)
{
    this.m_oControl = oControl;
    this.m_nW       = nW;
    this.m_nSpace   = nSpace;
    this.m_eAlign   = eAlign;
}
CDrawingToolbarItem.prototype.Get_Control = function(){return this.m_oControl;};
CDrawingToolbarItem.prototype.Get_W = function(){return this.m_nW;};
CDrawingToolbarItem.prototype.Get_Space = function(){return this.m_nSpace;};
CDrawingToolbarItem.prototype.Get_Align = function(){return this.m_eAlign;};
