<%@ Page Language="C#" AutoEventWireup="true" EnableEventValidation="false"  CodeFile="ZK_KSZX_R_list.aspx.cs" Inherits="ZK_KSZX_R_list" %>
<!DOCTYPE html>
<html >
<head runat="server">
    <script type="text/javascript" src="js/jsPublic.js" charset="UTF-8"></script>
    <script type="text/javascript" src="js/calendar.js" charset="UTF-8"></script>
    <script src="js/Html5Camera.js" charset="UTF-8"></script>
    <script src="js/ZK_STU_ZHSZ_B_js.js" type="text/javascript" ></script>
    <script src="js/ZK_STU_INFO_B_js.js" charset="UTF-8"></script>
    <title>考生照相</title><%=LookLibrary.SYS_NAV_STYLE_BControl.GetNavCSSTextByCode(this)%> 
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <table style="padding:0; width:100%;height:100%; border:0px;" cellpadding="0" cellspacing="0">
            <tr>
                <td id="title" class="title" valign="top" align="left" width="100%">
                    <asp:Label ID="lbl_msg" runat="server" Text="考生照相" style="width:auto;height:22px;float:left; font-weight:bold;padding-top:3px;"></asp:Label>
                    <div style="float:right;">
                      <asp:Button UseSubmitBehavior="false" ID="btn_close" runat="server" Text="返回" CssClass="btn_1" OnClick="btn_close_Click"  />
                    </div>
                </td>
            </tr>
            <!--查询开始-->
            <tr>
                <td id="queryTool" class="title1111" valign="middle" align="center" width="100%" height="auto" >
                    <fieldset id="toolfs" style="width:98%;height:45px; height:auto; text-align:left; padding-left:8px;">
                        <legend >查询条件:</legend>
                        <div style="float:left;  word-wrap:break-word;padding-top:5px; padding-left:4px; padding-right:10px;">
                        <table style="padding:0;border-right:#CCC dotted 1px;" cellpadding="0" cellspacing="0">
                          <tr>
                            <td  align="left" >中考报名号：</td>
                            <td >
                              <asp:TextBox ID="txt_query" runat="server" CssClass="txtbox_1"  style="width:125px;"></asp:TextBox>
                            </td>
                            <!--排序项自行增减 组合排序自行添加-->
                          </tr>
                        </table>
                        </div>
                        <div style="float:left; padding-top:8px; padding-left:4px;width:auto;margin:auto;">
                            <input id="btn_getStuInfo" type="button" value="查询" class="btn_1" onclick="GetZK_STU_INFO_B_ByZKBMH('txt_query', 'stuInfoDiv')" />
                            <input id="btn_openVideo" type="button" value="打开摄像头" class="btn_1"  onclick="OpenVideo('video_box')" />

                        </div>
                        <div id="stuInfoDiv" style="float:left; line-height:30px;padding-left:10px; font-size:16pt;color:#ed4619; width:auto;margin:auto;">

                        </div> 
                        <div style="float:right; padding-right:10px; font-size:14pt;color:#ed4619; width:auto;margin:auto;cursor:pointer;" 
                            onmouseover="$('memoInfo').style.display=''"
                            onmouseout ="$('memoInfo').style.display='none'"
                            >
                            查看照片规格
                        </div> 
                    </fieldset>
                </td>
            </tr>
            <!--查询结束-->
            <tr>
                <td id="_main1" valign="top" align="center">
                    <asp:Panel ID="grd_p" runat="server" CssClass="grd_pnl_tool" ScrollBars="Vertical" style="text-align:center;">
                        <div style="width:500px;height:420px;float:left; text-align:center;">
                            <div id="redBox" style="border:2px dotted #f00;position:absolute;left:224px;top:144px;width:180px;height:220px;"></div>
                            <video id="video_box" autoplay="" style="width:450px;height:350px;">
                                <p>你的浏览器是时候更新一下了!~不支持视频功能.320*260</p>
                            </video> 
                        <div id="checkBow" style="width:98%;color:blue;font-size:12pt;display:none;" >必须使用谷歌Chrome浏览器<a href="http://www.google.cn/intl/zh-CN/chrome/browser/" target="_blank" title="从官网下载">[下载]</a>&nbsp;或火狐FireFox浏览器<a href="http://www.firefox.com.cn/download/" target="_blank" title="从官网下载">[下载]</a></div>

                        </div> 
                        <div style="width:80px;height:420px; text-align:center; overflow:hidden;line-height:25px;margin:auto;float:left;">
                            <input id="btn_zx" type="button" value="" class="btn_1" title="照相" 
                                style="width:60px;height:60px;background:url(images/Camera2.png) no-repeat center center;border:0px;display:none;" 
                                onclick="scamera('video_box', 'canvas_Box', 260, 320)" /> <br />  
                        </div> 
                        <div style="width:280px;height:400px;float:right; text-align:center;margin:auto; overflow:hidden;overflow-y:auto;border:1px solid #ccc;">
                          <canvas id="canvas_Box" style="display:block;width:260px;height:320px;"></canvas>  <br /> 
                            
                            <input id="upPic" type="button" value="上传照片" class="btn_1" style="display:none;"  onclick="uploadPhoto('video_box', 260, 320)" />
                        </div>     
                    </asp:Panel>
                </td>
            </tr>
        </table>

        
    </div>
        
                            <div id="memoInfo" style="width:450px;height:200px;background:#fff;display:none; border:4px solid #ccc;padding:6px; line-height:24px;text-align:left;float:left;position:absolute;right:10px;top:80px; ">
                                <b>学生照片规格</b><br />
	                            1．白色背景颜色，正面免冠彩色头像数码照片。<br />
	                            2．照片规格:260(宽)× 320(高)【像素】 ，分辨率150dpi 以上。<br />
	                            3．人像在相片矩形框内水平居中，头部占照片尺寸的2 ／3。<br />
                                4. 常戴眼镜的学生应配戴眼镜，人像清晰，层次丰富，神态自然，无明显畸变。
                            </div>  
    </form>
</body>
</html>
<script  type="text/javascript" >


    checkBrowser();


    $("txt_query").onkeyup = function () {
        var _zkbmh = $("txt_query").value;
        if (_zkbmh.length < 5) return;
        SelectStuZKBMH("txt_query", _zkbmh, "stu");
    }
    var _videoPos= getObjectPos("video_box");
    $("redBox").style.left = _videoPos.left + 12 + ($("video_box").offsetWidth - $("redBox").offsetWidth) / 2 + "px";

</script>
<!--Auto Create By JLBIOS-->
