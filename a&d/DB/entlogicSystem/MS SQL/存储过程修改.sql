USE [YZXF_11]
GO
/****** Object:  UserDefinedFunction [dbo].[fun_getysjf]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create FUNCTION [dbo].[fun_getysjf](@zf_id varchar(50),@start_time varchar(50),@end_time varchar(50),@gydw varchar(10))
returns numeric(8,2)
as
begin
  declare @str numeric(8,2),@sum1 float,@sum2 float,@sum3 float,@sum4 float,@start1 varchar(10),@end1 varchar(10)
  set @start1=substring(@start_time,1,7)
  set @end1=substring(@end_time,1,7)
 
  set @str = 0

    select @sum1 =  sum(detain_score) from dbo.KH11_ZF_JKF a join zf_Jbxx b on a.zf_id=b.zf_id where b.gydw=''+@gydw+''  and a.zf_id=''+@zf_id+'' and acc_item = 'M'  and detain_score>0 and acc_valid='Y'  and acc_cumlate='N' and ACC_CUMLATE2='N' and FILL_DATE>=''+@start_time+''   and FILL_DATE<=''+@end_time+'' 
  
    select @sum2 =  sum(fz) from dbo.zf_yzjl a join zf_jbxx b  on a.zf_id=b.zf_id where  b.gydw=''+@gydw+''  and  a.zf_id=''+@zf_id+'' and vaild_Flag='Y'  and fz>0  and yyjx='N' and ACC_CUMLATE2='N' and cbrq>=''+@start_time+''   and cbrq<=''+@end_time+'' 
  
    select @sum3 =  sum(detain_score) from dbo.KH11_ZF_JKF a join zf_jbxx b   on a.zf_id=b.zf_id where   b.gydw=''+@gydw+''  and  a.zf_id=''+@zf_id+'' and (acc_item = 'L' or acc_item='B') and acc_valid='Y'  and acc_cumlate='N' and ACC_CUMLATE2='N' and FILL_DATE>=''+@start_time+''   and FILL_DATE<=''+@end_time+'' 
  
    select @sum4 =  sum(ydysf) from dbo.KH11_ZF_YKH_DJPB a join zf_jbxx b   on a.zf_id=b.zf_id where  b.gydw=''+@gydw+''  and  a.zf_id=''+@zf_id+''  and is_Vaild='Y' and ydysf>0 and acc_cumlate='N' and ACC_CUMLATE2='N' and khrq>=''+replace(@start1,'-','')+''   and khrq<=''+replace(@end1,'-','')+'' 

   if @sum1 is null or   @sum1 =''
      set @sum1 = 0
     
   if @sum2 is null or   @sum2 =''
      set @sum2 = 0

   if @sum3 is null or   @sum3 =''
      set @sum3 = 0

    if @sum4 is null or   @sum4 =''
      set @sum4 = 0

   set @str=@sum3+@sum4-@sum1-@sum2

return(@str)
End
GO
/****** Object:  UserDefinedFunction [dbo].[get_aflb]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--根据罪名分类编码、刑期，返回“案犯类别”编码
--select top 100 dbo.get_aflb(zmfl,(select top 1 xq from zf_xfzb where zf_id=a.zf_id and iszs='1')) from zf_jbxx a

CREATE function [dbo].[get_aflb]
(
	@zm varchar(10),    --罪名分类编码
	@xq varchar(8)      --刑期
)
returns char(1)

as
begin
	declare @aflb char(1)
	if @zm='2' or charindex(','+@zm+',',dbo.get_bms('1A','2'))>0
		set @aflb='1'    --危害国家安全
	else if left(@xq,2)>='15'
		set @aflb = '2'  --重大刑事犯
	else if left(@xq,2)>='10'
       and (@zm in('162','164','166','167','200','171','16','18','19','4120','234','235','236')
            or charindex(','+@zm+',',dbo.get_bms('1A','162'))>0   --故意杀人162
            or charindex(','+@zm+',',dbo.get_bms('1A','164'))>0   --故意伤害164
            or charindex(','+@zm+',',dbo.get_bms('1A','166'))>0   --强奸166
            or charindex(','+@zm+',',dbo.get_bms('1A','167'))>0   --奸淫幼女167
            or charindex(','+@zm+',',dbo.get_bms('1A','200'))>0   --抢劫200
            or charindex(','+@zm+',',dbo.get_bms('1A','171'))>0   --绑架171
            or charindex(','+@zm+',',dbo.get_bms('1A','16'))>0    --放火16
            or charindex(','+@zm+',',dbo.get_bms('1A','18'))>0    --爆炸18
            or charindex(','+@zm+',',dbo.get_bms('1A','19'))>0    --投毒19
            or charindex(','+@zm+',',dbo.get_bms('1A','4120'))>0  --投放危险物质4120
            or charindex(','+@zm+',',dbo.get_bms('1A','234'))>0   --黑社会性质组织234
            or charindex(','+@zm+',',dbo.get_bms('1A','235'))>0   --黑社会性质组织235
            or charindex(','+@zm+',',dbo.get_bms('1A','236'))>0)  --黑社会性质组织236
		set @aflb = '2'   --重大刑事犯
	else
		set @aflb = '3'   --一般刑事犯

	return @aflb
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_ancestor_table]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS OFF
GO
SET QUOTED_IDENTIFIER ON
GO


--返回无含义编码的编码及其对应的顶级码
--select * from  dbo.get_ancestor_table('1a')

CREATE  FUNCTION [dbo].[get_ancestor_table]
(
  @lb varchar(3)
)
returns @res table (bm varchar(7),djm varchar(7),flag bit) --编码  顶级码  顶级码是否已赋值（计算时使用的临时字段）
as
begin
  insert into @res(bm,djm,flag)
      select bm,sjbm,0 from pub_dmb where lb=@lb
  while exists(select 1 from @res where flag=0)
    begin
      update @res set djm=b.sjbm from pub_dmb b where flag=0 and djm=b.bm and b.lb=@lb and isnull(b.sjbm,'')<>'' 
      update @res set flag=1 where not exists(select 1 from pub_dmb b where djm=b.bm and b.lb=@lb  and isnull(b.sjbm,'')<>'')
    end 
  update @res set djm=bm where djm=''
  return
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_bjr]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回包夹人信息
--select top 1000 dbo.get_bjr(zf_id,null,'1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_bjr]
(
 @zf_id varchar(50),
 @jzrq datetime,    --截止日期(NULL表示当前日期)
 @cs char(1)        --1返回该罪犯的包夹人，格式：XXX、XXX  2返回该罪犯包夹的对象,格式：XXX的包夹人
)
returns varchar(100)

as
begin
  declare @jg varchar(100)
  set @jg=''
  
  if @cs='1'
    --返回该罪犯的包夹人
    begin
      if @jzrq is null
        select @jg=@jg+(case when @jg='' then '' else '、' end)+
                       (case when len(a.bjr1)=50 then (select top 1 xm from zf_jbxx where zf_id=a.bjr1) when a.bjr1<>'' then rtrim(a.bjr1) else '' end)+
                       (case when a.bjr1<>'' and a.bjr2<>'' then '、' else '' end)+
                       (case when len(a.bjr2)=50 then (select top 1 xm from zf_jbxx where zf_id=a.bjr2) when a.bjr2<>'' then rtrim(a.bjr2) else '' end)
          from zf_wwzk a where a.zf_id=@zf_id and a.cxrq is null and vaild_flag='Y' and (a.bjr1<>'' or a.bjr2<>'')
      else
        select @jg=@jg+(case when @jg='' then '' else '、' end)+
                       (case when len(a.bjr1)=50 then (select top 1 xm from zf_jbxx where zf_id=a.bjr1) when a.bjr1<>'' then rtrim(a.bjr1) else '' end)+
                       (case when a.bjr1<>'' and a.bjr2<>'' then '、' else '' end)+
                       (case when len(a.bjr2)=50 then (select top 1 xm from zf_jbxx where zf_id=a.bjr2) when a.bjr2<>'' then rtrim(a.bjr2) else '' end)
          from zf_wwzk a where a.zf_id=@zf_id and a.pzrq<=@jzrq and (a.cxrq is null or a.cxrq>@jzrq) and vaild_flag='Y' and (a.bjr1<>'' or a.bjr2<>'')
    end
  else
    --返回该罪犯包夹的对象
    begin
      if @jzrq is null
        select @jg=@jg+(case when @jg='' then '' else '、' end)+b.xm
          from zf_wwzk a join zf_jbxx b on a.zf_id=b.zf_id
          where (a.bjr1=@zf_id or a.bjr2=@zf_id) and a.cxrq is null and vaild_flag='Y'
      else
        select @jg=@jg+(case when @jg='' then '' else '、' end)+b.xm
          from zf_wwzk a join zf_jbxx b on a.zf_id=b.zf_id
          where (a.bjr1=@zf_id or a.bjr2=@zf_id) and a.pzrq<=@jzrq and (a.cxrq is null or a.cxrq>@jzrq) and vaild_flag='Y'
      if @jg<>''
        set @jg=@jg+'的包夹人'
    end
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_bjyfx_nx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回罪犯在本监狱服刑的年限  返回格式：040312（年月日各2位字符）
--select top 100 dbo.get_bjfx(zf_id,'20121231','') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_bjyfx_nx]
(
 @zf_id varchar(50),
 @jzrq datetime,   --截止时间（不允许NULL）
 @dwbm varchar(6)  --用户单位编码（预留参数，用于用户特殊需求）
)
returns varchar(6)
as
begin
  declare @jg varchar(6),
          @qsrq datetime,   --起算日期
          @ljrq datetime,   --离监日期
          @rq_1  datetime,  --临时变量
          @rq_2  datetime,  --临时变量
          @day   int,       --止日顺延天数
          @day_1 int,       --假释收监的假释期间的天数
          @day_2 int,       --脱逃天数
          @day_3 int,       --监外执行脱管天数
          @sjbm varchar(6)  --上级编码

  --读取收押日期,离监日期（收押日期作为起算日期）
  if @jzrq is not null
    select top 1 @qsrq=syrq,@ljrq=ljrq from zf_crj where zf_id=@zf_id and syrq<=@jzrq order by syrq desc,cjsj desc 
  
  if @qsrq is null or @qsrq>@jzrq or @jzrq is null
    --起算日期或截止日期空，返回空串
    set @jg=''
  else
    begin
      if @ljrq is not null
        --已离监
        set @jzrq=@ljrq  --截止日期为离监日期
      
      --检查是否有“止日顺延”记录
      set @rq_1=(select max(zxrq) from zf_xfzb where zf_id=@zf_id and zxrq>=@qsrq and zxrq<=@jzrq and bdlb='20')
      if isdate(@rq_1)=1
        --有“止日顺延”记录，计算顺延天数
        select @day=@day+cast(bdfd as int) from zf_xfzb where zf_id=@zf_id and zxrq>=@qsrq and zxrq<=@jzrq and bdlb='20'
      else
        --无“止日顺延”记录
        set @rq_1=@qsrq
      
      --判断“止日顺延”之后是否有监外执行脱管记录
      while exists (select 1 from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zf_id=@zf_id and b.tgqr>@rq_1 and b.tgqr<=@jzrq)
      begin
        --遍历各次监外执行脱管起日、止日
        select top 1 @rq_1=b.tgqr,@rq_2=b.tgzr from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zf_id=@zf_id and b.tgqr>@rq_1 and b.tgqr<=@jzrq order by b.tgqr
        if isdate(@rq_1)=1 and isdate(@rq_2)=1 and @rq_2>@rq_1
          --有脱管起止日，计算脱管天数
          set @day_3=@day_3+datediff(dd,@rq_1,@rq_2)
        else if isdate(@rq_1)=1 and isdate(@rq_2)=0
          begin
            --有脱管起日，无脱管止日，判断是否已收监，若已收监，将收监日期作为脱管止日
            set @rq_2=(select top 1 zzrq from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zf_id=@zf_id and a.zzrq>@rq_1 and a.zzrq<=@jzrq order by zzrq)
            if isdate(@rq_2)=1
              --有收监日期，计算脱管天数
              set @day_3=@day_3+datediff(dd,@rq_1,@rq_2)
            else
              begin
                --未收监，将脱管起日-1作为计算实际刑期的截止日期
                set @jzrq=dateadd(dd,-1,@rq_1)
                break
              end
          end
      end
      
      --检查是否有“假释收监”情况,若有，计算假释期间的天数（按假释期间不计入实际刑期计算）
      set @rq_1=@qsrq
      while exists (select 1 from zf_crj where zf_id=@zf_id and ljrq>@rq_1 and ljrq<=@jzrq and ljlb='15')
      begin
        --读取假释离监日期
        select @rq_1=min(ljrq) from zf_crj where zf_id=@zf_id and ljrq>@rq_1 and ljrq<=@jzrq and ljlb='15'
        --读取假释收监日期
        select @rq_2=min(syrq) from zf_crj where zf_id=@zf_id and syrq>@rq_1 and syrq<=@jzrq and sylb='3'
        if isdate(@rq_1)=1 and isdate(@rq_2)=1 and @rq_2>@rq_1
          --有收监日期，计算假释天数
          set @day_1=@day_1+datediff(dd,@rq_1,@rq_2)
      end
      
      --检查是否有“脱逃记录”记录,若有，计算在逃天数
      if exists (select 1 from zc_tt where zf_id=@zf_id and ttrq>=@qsrq and ttrq<=@jzrq)
        begin
          select @day_2=@day_2+datediff(dd,ttrq,bhrq) from zc_tt where zf_id=@zf_id and ttrq>=@qsrq and bhrq>ttrq and bhrq<=@jzrq
          --检查是否有尚未捕回记录，若有，将脱逃日期-1作为计算实际刑期的截止日期
          set @rq_1=(select top 1 ttrq from zc_tt where zf_id=@zf_id and ttrq>=@qsrq and ttrq<=@jzrq and bhrq is null order by ttrq)
          if isdate(@rq_1)=1
            set @jzrq=dateadd(dd,-1,@rq_1)
        end
      
      --不计入刑期的天数相加
      set @day=isnull(@day,0)+isnull(@day_1,0)+isnull(@day_2,0)+isnull(@day_3,0)
      
      if @day>0
        --起算日期后延
        set @qsrq=@qsrq+@day
      
      --形成已服刑期字串(格式：120100)
      set @jg=dbo.get_sjjg(@qsrq,@jzrq)
    end
    
  return @jg
end








GO
/****** Object:  UserDefinedFunction [dbo].[get_bms]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回某编码及其所有下级编码串，格式：,1,5,8,
--select dbo.get_bms('1A',a.bm) from pub_dmb a where lb='1A'

CREATE function [dbo].[get_bms]
(
 @lb varchar(3), --编码类别
 @bm varchar(60) --编码或逗号分隔的编码串，编码串格式为：5,7,10
)
returns varchar(3000)
as
begin
  declare @jg varchar(3000),@bms varchar(6),@sjbm varchar(6),@p int,@trim_0 int
  set @jg=','
  
  if (select bmfs from zd_dmlb where lb=@lb)=1
    --编码是层次编码
    begin
      set @trim_0=(select rtrim_0 from zd_dmlb where lb=@lb)  --是否去掉编码右侧的0
      if @bm not like ','
        --传入的为一个编码
        begin
          if @trim_0=1
            begin
              while right(@bm,1)=0 and len(@bm)>1
                begin
                  set @bm=left(@bm,len(@bm)-1)
                end
            end
          select @jg=@jg+bm+',' from pub_dmb where lb=@lb and bm like @bm+'%' order by bm
        end
      else
        --传入的为多个编码
        begin
          while @bm<>''
            begin
              set @p=charindex(',',@bm)
              if @p>0
                begin
                  set @bms=left(@bm,@p-1)
                  select @jg=@jg+bm+',' from pub_dmb where lb=@lb and bm like @bms+'%' order by bm
                  set @bm=substring(@bm,@p+1,60)
                end
              else
                begin
                  select @jg=@jg+bm+',' from pub_dmb where lb=@lb and bm like @bm+'%' order by bm
                  set @bm=''
                end
            end
        end
    end
  else
    --编码为无含义编码
    begin
      if @bm not like '%,%'
        --传入的为一个编码
        begin
          set @jg=@jg+@bm+','
          while exists (select 1 from pub_dmb where lb=@lb and charindex(','+sjbm+',',@jg)>0 and charindex(','+bm+',',@jg)=0)
            begin
              select @jg=@jg+bm+',' from pub_dmb where lb=@lb and charindex(','+sjbm+',',@jg)>0 and charindex(','+bm+',',@jg)=0
            end
        end
      else
        --传入的为多个编码
        begin
          while @bm<>''
            begin
              set @p=charindex(',',@bm)
              if @p>0
                begin
                  set @bms=left(@bm,@p-1)
                  set @bm=substring(@bm,@p+1,60)
                end
              else
                begin
                  set @bms=@bm
                  set @bm=''
                end
              set @jg=@jg+@bms+','
              while exists (select 1 from pub_dmb where lb=@lb and charindex(','+sjbm+',',@jg)>0 and charindex(','+bm+',',@jg)=0)
                begin
                  select @jg=@jg+bm+',' from pub_dmb where lb=@lb and charindex(','+sjbm+',',@jg)>0 and charindex(','+bm+',',@jg)=0
                end
            end
        end
    end

  if @jg=','
    set @jg=''

  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_bznx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回剥政年限
--select top 1000 dbo.get_bznx(zf_id,null,'1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_bznx]
(
 @zf_id varchar(50),
 @jzrq datetime,    --截止日期(传NULL 表示当前日期)
 @cs varchar(2)     --返回值格式  0或空：返回字段值   1：返回yy_mm_dd   2：返回yy年m个月d天
)
returns varchar(40)

as
begin
  declare @jg varchar(40)
  
  if @jzrq is null
    --读取最新剥政年限
    select top 1 @jg=bznx from zf_xfzb where zf_id=@zf_id and flag='1'
  else
    --读取截止日期前的剥政年限
    select top 1 @jg=bznx from zf_xfzb where zf_id=@zf_id and pcrq<=@jzrq and pcrq>=(select pcrq from xfzb where zf_id=@zf_id and iszs='1') order by pcrq desc,cjsj desc
  
  if @jg is null or isnumeric(@jg)=0
    return ''
  if cast(@jg as int)=0
    return ''
  
  if @jg='99'
    set @jg='终身'
  else
    begin
      if @cs='1'
        --返回值形式：10_06_03
        set @jg=left(@jg,2)+'_'+substring(@jg,3,2)+'_'+substring(@jg,5,2)
      else
        --返回值形式：10年6个月3天
        set @jg=(case when @jg like '00%' then '' else cast(cast(left(@jg,2) as int) as varchar(2))+'年' end)+
                (case when @jg like '__00%' then '' else cast(cast(substring(@jg,3,2) as int) as varchar(2))+'个月' end)+
                (case when @jg like '____00' then '' else cast(cast(substring(@jg,5,2) as int) as varchar(2))+'天' end)
    end
    
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_cb_gzbx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回呈报用改造表现（奖惩），格式：2012年5月19日 记功

--select top 100 zf_id,xm,dbo.get_cb_gzbx(zf_id,'20051231','',2,'') from zf_jbxx where zybz='1' and exists (select 1 from zf_yzjl where zf_id=zf_jbxx.zf_id)

CREATE FUNCTION [dbo].[get_cb_gzbx]
(
 @zf_id varchar(50),
 @rq datetime,       --起始日期，返回该日期之后的奖惩记录（若为NULL，返回全部奖惩记录）
 @dwbm varchar(4),   --用户单位编码(预留，用于应对用户特殊需求)
 @jclx tinyint,      --0惩  1奖  2奖惩
 @cs   varchar(4)    --其他参数，可连用（H 每记录换行）
)
RETURNS varchar(5000)
as  
BEGIN 

declare @jg varchar(5000),@cr varchar(10),@pzrq datetime,@have_jx char(1)
set @jg=''
set @cr=(case when @cs like '%H%' then char(13)+char(10) else ',' end)
set @pzrq=(case when @rq is null then '19500101' else @rq end)

if @jclx>1
  --奖惩
  begin
    select @jg=@jg+(case when @jg='' then '' else @cr end)+(dbo.get_mask_date(pzrq,2,4)+' '+dbo.get_mc('1W',jclb))
      from (select '1W' as bmlb,pzrq,jllb as jclb from zf_yzjl where zf_id=@zf_id and pzrq>=@pzrq and vaild_flag='Y'
            union all
            select '3L' as bmlb,pzrq,cclb as jclb from zf_yzcc where zf_id=@zf_id and pzrq>=@pzrq and vaild_flag='Y') t
      order by pzrq
    if @jg=''
      set @jg='无奖惩记录'
  end
else if @jclx=1
  --奖励
  begin
    select @jg=@jg+(case when @jg='' then '' else @cr end)+(dbo.get_mask_date(pzrq,2,4)+' '+dbo.get_mc('1W',jllb))
      from zf_yzjl where zf_id=@zf_id and pzrq>=@pzrq and vaild_flag='Y' order by pzrq
    if @jg=''
      set @jg='无奖励记录'
  end
else if @jclx=0
  --处罚
  begin
    select @jg=@jg+(case when @jg='' then '' else @cr end)+(dbo.get_mask_date(pzrq,2,4)+' '+dbo.get_mc('3L',cclb))
      from zf_yzcc  where zf_id=@zf_id and pzrq>=@pzrq and vaild_flag='Y' order by pzrq
    if @jg=''
      set @jg='无处罚记录'
  end
  
return @jg
END




GO
/****** Object:  UserDefinedFunction [dbo].[get_cb_jx_bx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--函数功能：返回尚未用于奖惩的奖励记录串，用于《减刑建议书》中“确有  表现”之后的改造表现
--select top 100 dbo.get_cb_jx_bx(zf_id,'') from zf_jbxx where zybz='1'

CREATE  FUNCTION [dbo].[get_cb_jx_bx]
(
 @zf_id varchar(50),   --罪犯ID
 @dwbm varchar(10)     --用户单位编码（预留，用于用户特殊需求）
)
RETURNS varchar(1000)
BEGIN
  declare @jg varchar(1000)
	set @jg=''

   --返回尚未用于减刑的奖励记录
   select @jg=@jg+(case when @jg='' then '' else '，' end)+
              dbo.get_mask_date(pzrq,2,4)+dbo.get_mc('1W',jllb)
     from zf_yzjl where zf_id=@zf_id and pzrq is not null and yyjx='1' and vaild_flag='Y' order by pzrq
   
   if @jg=''
     set @jg='无尚未用于减刑的狱政奖励'
  
	return @jg
END





GO
/****** Object:  UserDefinedFunction [dbo].[get_cb_jxjsjys_xfbd]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--函数功能：返回《减刑建议书》《假释建议书》刑期变动情况
--select top 1000 dbo.get_cb_jxjsjys_xfbd(zf_id) from zf_jbxx where zybz='1'

CREATE FUNCTION [dbo].[get_cb_jxjsjys_xfbd]
(
@zf_id varchar(50)
)  
RETURNS varchar(5000)
  
BEGIN 
  declare @jg     varchar(5000),
          @zm     varchar(80),  --罪名
          @pjjg   varchar(80),  --判决机关
          @pjrq   varchar(20),  --判决日期(汉字形式）
          @pjrqs  datetime,     --判决日期
          @xq     varchar(40),   --刑期
          @bznx   varchar(40),   --剥政
          @qr     varchar(20),   --起日
          @zr     varchar(20),   --止日
          @bdlb   varchar(3),   --刑罚变动类别
          @pcnd   varchar(4),   --刑罚变动年度
          @pczh   varchar(40),  --刑罚变动字号（字）
          @pcxh   varchar(40),  --刑罚变动字号（序号）
          @pjzh   varchar(80),  --刑罚变动字号
          @bdfd   varchar(6),   --刑罚变动幅度
          @s      varchar(40),
          @s1     varchar(40),
          @c_top  varchar(200),
          @c_xfbd varchar(1000), --刑罚变动串
          @c      varchar(60),
          @c_pjs  varchar(20),
          @zsrq   datetime

  --读取终审判决日期
  select @zsrq=pcrq from zf_xfzb where zf_id=@zf_id and iszs='1'
   
  --读取刑罚变动数据,形成字串
  set @jg = ''
  set @c_xfbd=''
  declare cur_xfbd cursor scroll for
    select a.bdlb,a.pcqh+a.pcmx,a.pcrq,a.pcnd,a.pczh,a.pcxh,
           dbo.get_xz(a.xq)+dbo.get_mask_xq(a.xq,'2',''),
           dbo.get_mask_date(a.qr,'2','4'),
           dbo.get_mask_date(a.zr,'2','4'),
           dbo.get_mask_bznx(a.bznx,'2','剥夺政治权利'),a.bdfd
      from zf_xfzb a
      where zf_id=@zf_id and bdlb<>'' and pcrq>@zsrq order by pcrq
  open cur_xfbd
  fetch cur_xfbd into @bdlb,@pjjg,@pjrqs,@pcnd,@pczh,@pcxh,@xq,@qr,@zr,@bznx,@bdfd
  while @@fetch_status=0
    begin
      if @c_xfbd<>''
        set @c_xfbd=@c_xfbd+'；'  --两次刑罚变动之间用“分号”分隔
      set @pjrq=dbo.get_mask_date(@pjrqs,'2','4')  --汉字形式判决日期
      if @pjjg=''
        set @pjjg='          人民法院'
      if @pjrq=''
        set @pjrq='    年  月  日'
      if @qr=''
        set @qr='    年  月  日'
      if @zr=''
        set @zr='    年  月  日'
      set @c_pjs='刑事裁定书'
      if left(@bdlb,2) in ('1','2','3','4','5','6','11','12','13','14','16','19')
        --判决1 改判2 解回重新判决3 狱内加刑4 狱外加刑5  余罪加刑6 赦免释放11 免刑释放12 改判释放13 无罪释放14  处决16  免予新收处罚19
        set @c_pjs='刑事判决书'
      --处理字号
      set @pjzh=''  -- '(    )    字第   号'	
      if @pcnd<>''or @pcxh<>'' or @pczh<>''
        begin
          if @pcnd<>''and  @pcxh<>'' and @pczh<>''
            set @pjzh=dbo.get_zh(@pcnd,@pczh,@pcxh)
          else if  @pcxh<>'' and @pczh<>''
            set @pjzh='(    )'+dbo.get_zh(@pcnd,@pczh,@pcxh)
          else if @pcnd<>''and @pczh<>''
            set @pjzh=left(dbo.get_zh(@pcnd,@pczh,@pcxh),6)+'    字'+substring(dbo.get_zh(@pcnd,@pczh,@pcxh),7,12)
          else
            set @pjzh='(    )'+dbo.get_zh(@pcnd,@pczh,@pcxh)+'第   号'
        end
      --处理剥政
      if @bznx<>''
        set @bznx='，附加'+@bznx
      
      --每次刑罚变动串前面的文字（样式：x年x月x日经xxxx法院 + when 字号<>'' '以(1998)刑字第x号判决书' )
      set @c_top=@pjrq+'经'+@pjjg+(case when @pjzh='' then '' else '以'+@pjzh+@c_pjs end)
      
      --连接刑罚变动串
      if left(@bdlb,2) in ('4','5','6','7','8')
        --加刑、减刑
        begin
          if @xq='死刑'
            set @c_xfbd=@c_xfbd+@c_top+'判处死刑'
          else
            begin
              set @c_xfbd=@c_xfbd+@c_top+(case when left(@bdlb,2) in ('7','8') then '裁定减刑' else '判处加刑' end)
              --处理变动幅度
              set @s=(case when left(@bdlb,2) in ('4','5','6') then '加' else '减' end)
              if @bdfd='9995' or left(@xq,1)='无'
                --变动幅度为“无期” 或 刑期为“无期”
                set @c_xfbd=@c_xfbd+(case when @s='减' then '，减为' else '，加至' end)+'无期徒刑'+@bznx
              else if @bdfd='9996' or @xq like '%缓期'
                --变动幅度为“死缓” 或 刑期为“死缓”
                set @c_xfbd=@c_xfbd+(case when @s='减' then '，减为' else '，加至' end)+'死刑，缓期二年执行'+@bznx
              else if @bdfd='9990'
                --变动幅度为“有期”
                set @c_xfbd=@c_xfbd+(case when @s='减' then ',减为' else ',加至' end)+	@xq+'，刑期自'+@qr+'至'+@zr+'止'+@bznx
              else if @bdfd<>'' and left(@bdfd,2)<'99'
                --变动幅度为“数字”
                begin
                  set @c=dbo.get_mask_xq(@bdfd,'2','')  --将变动幅度转为汉字形式
                  set @c_xfbd=@c_xfbd+(case when @c='' or @c is null then '  年  个月' else @c end)+'，执行'+@xq+'，刑期自'+@qr+'至'+@zr+'止'+@bznx
                end
              else
                --无变动幅度
                set @c_xfbd=@c_xfbd+'，执行'+@xq+'，刑期自'+@qr+'至'+@zr+'止'+@bznx
            end
        end
      else if @bdlb='21'
        --刑罚合并
        set @c_xfbd=@c_xfbd+'合并执行'+@xq+(case when left(@xq,1)='有' then '，刑期自'+@qr+'至'+@zr+'止' else '' end)+@bznx
      else if left(@bdlb,2) in ('1','2','3')
        --判决、改判 解回重新判决
        begin
          set @zm=dbo.get_zm_bypcrq(@zf_id,@pjrqs,'')  --读取该次判决罪名
          if @zm=''
            set @zm='        罪'
          else if right(@zm,1)<>'罪'
            set @zm=@zm+'罪'
          set @c_xfbd=@c_xfbd+@c_top+(case when @bdlb='1' then '判决' when @bdlb='2' then '改判' else '重新判决' end)+'，'+@zm+'，'+@xq+(case when left(@xq,1)='有' then '，刑期自'+@qr+'至'+@zr+'止' else '' end)+@bznx
        end
      else if left(@bdlb,2)='20'
        --止日顺延
        begin
          set @c=''
          if exists (select 1 from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zzrq>dateadd(month,-3,@pjrqs) and b.tgqr is not null)
            --判决日期前3个月内有监外执行收监且曾脱管的记录
            set @c='监外执行期间脱管'
          else if exists (select 1 from zf_jgzs a join zf_jhzs_tg b on a.oid=b.zf_jhzs_oid where a.zzrq>dateadd(month,-3,@pjrqs) and b.tgqr is not null)
            --判决日期前3个月内有解回再审收监且曾脱管的记录
            set @c='解回再审期间脱管'
          set @c_xfbd=@c_xfbd+'因'+(case when @c='' then '       ' else @c end)+'，'+@pjrq+'经监狱管理局批准刑期止日顺延'+(case when @bdfd<>'' then @bdfd+'天' else '' end)+'，刑期止日'+@zr
        end
      else if left(@bdlb,2) in ('10','11','12','13,','14','15','16','17')
        --减余刑释放 赦免释放 免刑释放 改判释放 无罪释放   假释 处决 假释收监
        set @c_xfbd=@c_xfbd+@c_top+substring(@c_pjs,3,2)+dbo.get_mc('1Q',@bdlb)
      else
        --其它刑罚变动
        begin
          if @bdlb='18'           --撤销减刑
            set @c='裁定撤销减刑'
          else if @bdlb='9'      --减附加刑
            set @c='裁定减附加刑'
          else                    --裁定
            set @c='裁定'
          set @c_xfbd=@c_xfbd+@c_top+@c+'，执行'+@xq+(case when left(@xq,1)='有' then '，刑期自'+@qr+'至'+@zr+'止' else '' end)+@bznx
        end
      
      fetch cur_xfbd into @bdlb,@pjjg,@pjrqs,@pcnd,@pczh,@pcxh,@xq,@qr,@zr,@bznx,@bdfd
    end      
  close cur_xfbd
  deallocate cur_xfbd
  
  if @c_xfbd<>''
    set @c_xfbd=@c_xfbd+'。'
  if @c_xfbd=''
    set @jg='未变动。'	
  else
    set @jg='变动情况：'+@c_xfbd
  return @jg
END




GO
/****** Object:  UserDefinedFunction [dbo].[get_cb_xqbd]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回刑罚变动串

/* 返回形式参数说明
1   短格式
1H  短格式（每记录换行）
2   中长格式(有变动后的刑期)
2H  中长格式（每记录换行）
3   长格式(有变动后的刑期、起日、止日)
3H  长格式(每记录换行)
*/
--select top 1000 dbo.get_cb_xqbd(zf_id,null,null,'3h','') from zf_jbxx where zybz='1' 

CREATE FUNCTION [dbo].[get_cb_xqbd]
(
@zf_id varchar(50),  --罪犯ID
@qr datetime,        --日期范围起（可传NULL）
@zr datetime,        --日期范围止（可传NULL）
@cs   varchar(2),  --返回形式参数
@dwbm varchar(4)     --用户单位编码
)
RETURNS varchar(5000)
AS  
BEGIN 
  declare @jg varchar(5000),@flag char(1),@cr varchar(10),@rq_1 datetime,@rq_2 datetime,@zsrq datetime,@xq_ori varchar(10)
  set @jg=''
  set @cr=(case when @cs like '%H%' then char(13)+char(10) else '，' end)
  set @flag=left(@cs,1)
  set @rq_1=(case when @qr is null then '19500101' else @qr end)
  set @rq_2=(case when @zr is null then '99991231' else @zr end)
    
  --读取终审日期、终审刑期
  select @zsrq=pcrq,@xq_ori=xq from zf_xfzb where zf_id=@zf_id and iszs='1'
  
  --生成刑罚变动串
  select @jg=@jg+(case when @jg='' then '' else @cr end)+
      (case 
       when bdlb in ('7','8','10')  --狱内减刑/狱外减刑/减刑释放
         then dbo.get_mask_date(pcrq,2,4)+
              (case when bdfd='9990' then '减为有期徒刑'+dbo.get_mask_xq(xq,2,'')+(case when @flag='3' then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end)
                    when xq like '99%' then '减为'+dbo.get_mask_xq(xq,2,'')+(case when dbo.get_mask_xq(xq,2,'') not like '%徒刑' then '徒刑' else '' end)
                    when not (bdfd='' or bdfd is null) and bdfd<'100000' then '减刑'+dbo.get_mask_xq(bdfd,2,'')+(case when @flag in ('2','3') then ',刑期'+dbo.get_mask_xq(xq,2,'') else '' end)+(case when @flag='3' then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end)
                    when bdfd>='100000' and bdfd not like '99%' and @xq_ori like '99%' then '减为有期徒刑'+dbo.get_mask_xq(xq,2,'')+(case when @flag='3' then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end)
                    when not (bdfd='' or bdfd is null) then '减刑'+dbo.get_mask_xq(bdfd,2,'')+(case when @flag in ('2','3') then ',刑期'+dbo.get_mask_xq(xq,2,'') else '' end)+(case when @flag='3' then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end)
                    else '减刑,减刑后刑期'+dbo.get_mask_xq(xq,2,'')+(case when @flag='3' then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end) end)
       when bdlb in ('4','5','6')   --狱内加刑/狱外加刑/余罪加刑
         then dbo.get_mask_date(pcrq,2,4)+
              (case when bdlb='6' then '因余罪' else '' end)+
              (case when xq like '99%' then '加刑至'+dbo.get_mask_xq(xq,2,'')
                    when not (bdfd='' or bdfd is null) then '加刑'+dbo.get_mask_xq(bdfd,2,'')+(case when @flag in ('2','3') then ',刑期'+dbo.get_mask_xq(xq,2,'') else '' end)+(case when @flag='3' then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end)
                    else '加刑,加刑后刑期'+dbo.get_mask_xq(xq,2,'')+(case when @flag='3' then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end) end)
       when bdlb in ('1','2','3') --改判、解回重新判决
         then dbo.get_mask_date(pcrq,2,4)+
              (case when bdlb='1' then '判决' when bdlb='2' then '改判' else '解回重新判决' end)+',刑期'+dbo.get_mask_xq(xq,2,'')+(case when @flag='3' then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end)
       when bdlb in ('20','21')--止日顺延、刑罚合并
         then dbo.get_mask_date(pcrq,2,4)+dbo.get_mc('1Q',bdlb)+',刑期'+dbo.get_mask_xq(xq,2,'')+(case when @flag='3' then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end)
       when bdlb in ('11','12','14','15','16') --赦免释放/免刑释放/无罪释放/假释/处决
         then dbo.get_mask_date(pcrq,2,4)+dbo.get_mc('1Q',bdlb)
       when bdlb='13'  --改判释放
         then dbo.get_mask_date(pcrq,2,4)+'改判释放,改判刑期'+dbo.get_mask_xq(xq,2,'')
       else dbo.get_mask_date(pcrq,2,4)+dbo.get_mc('1Q',bdlb)+',刑期'+dbo.get_mask_xq(xq,2,'')+(case when @flag='3' and not (qr is null or zr is null) then ',自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end)
       end),
       @xq_ori=xq
  from zf_xfzb a
  where zf_id=@zf_id and pcrq between @rq_1 and @rq_2 and pcrq>@zsrq order by pcrq

  if @jg=''
    set @jg='无加减刑记录'
  
  return @jg
END






GO
/****** Object:  UserDefinedFunction [dbo].[get_cb_xqbd_yzjc]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--函数功能：返回呈报表中“改造表现”文字串
--select top 500 dbo.get_cb_xqbd_yzjc(zf_id,null,null,'2','2','1','') from zf_jbxx where zybz='1'

CREATE FUNCTION [dbo].[get_cb_xqbd_yzjc]
(
 @zf_id varchar(50),
 @qrs datetime,       --起日期（可空）
 @zrs datetime,       --止日期（可空）
 @xfbd_cs varchar(2), --刑期变动输出参数  1:短格式  2:中长格式(有变动后的刑期)  3长格式(有变动后刑期、起日、止日)  H:每记录换行,如1H  2H
 @yzjc_cs varchar(2), --狱政奖惩输出参数  1H:每行1个记录  2H:每行2个记录  0：记录间不换行
 @cs varchar(2),      --返回形式参数  1刑罚变动在前，狱政奖惩在后   2按日期先后返回刑罚变动与狱政奖惩
 @dwbm varchar(6)     --用户单位编码
)
RETURNS varchar(3000)

BEGIN 
  declare @jg varchar(3000),@qr datetime,@zr datetime,@zsrq datetime,@row_rec_num int,@lb varchar(10),@xf_cs varchar(2),@jc_cs varchar(2),@xq_ori varchar(10),
          @pcrq varchar(20),@bdlb varchar(40),@bdfd varchar(10),@xq varchar(10),@n int,@have_xf char(1),@have_jc char(1),@ori_lb varchar(10)
  select  @jg=''
  
  set @qr=(case when @qrs is null then '19500101' else @qrs end)
  set @zr=(case when @zrs is null then '99991231' else @zrs end)
  
  set @xf_cs=left(@xfbd_cs,1)
  set @jc_cs=left(@yzjc_cs,1)
  set @have_xf='0'
  set @have_jc='0'
  set @ori_lb=''
  
  set @row_rec_num=3000
  if isnumeric(left(@jc_cs,1))=1
    begin
      if @jc_cs>'0'
        set @row_rec_num=cast(@jc_cs as int)
    end
  
  if @cs='1'
    --先刑罚变动，后狱政奖惩
    begin
      set @jg=dbo.get_cb_xqbd(@zf_id,@qr,@zr,@xfbd_cs,@dwbm)
      if @jg is null
        set @jg=''
      if @jg<>'' and right(@jg,1)<>char(10)
        set @jg=@jg+char(10)
      set @jg=@jg+dbo.get_yzjc(@zf_id,@qr,@zr,@yzjc_cs+'C',@dwbm)
    end
  else
    --按日期先后返回刑罚变动与狱政奖惩
    begin
      --读取终审日期、终审刑期
      select @zsrq=pcrq,@xq_ori=xq from zf_xfzb where zf_id=@zf_id and iszs='1'
      
      --建立刑罚变动及狱内奖惩游标
      declare cur cursor for
        select 'XFBD' as lb,dbo.get_mask_date(pcrq,2,4) as pcrq,bdlb,isnull(bdfd,'') as bdfd,xq,qr,zr from zf_xfzb a where zf_id=@zf_id and pcrq>@zsrq
        union all
        select bmlb as lb,dbo.get_mask_date(pzrq,2,4) as pcrq,jclb,'','',null,null
          from (select '1W' as bmlb,pzrq,dbo.get_mc('1W',jllb) as jclb from zf_yzjl where zf_id=@zf_id and pzrq between @qr and @zr and vaild_flag='Y' and isnull(jllb,'')<>''
                union all
                select '3L' as bmlb,pzrq,dbo.get_mc('3L',cclb) as jclb from zf_yzcc where zf_id=@zf_id and pzrq between @qr and @zr and vaild_flag='Y' and isnull(cclb,'')<>'') as yzjc
        order by pcrq
      open cur
      fetch cur into @lb,@pcrq,@bdlb,@bdfd,@xq,@qr,@zr
      while @@fetch_status=0
        begin
          if @lb='XFBD'
            --刑罚变动
            begin
              set @have_xf='1'
              set @ori_lb=@lb
              set @n=0
              set @jg=@jg+(case when @jg='' then @pcrq else char(10)+@pcrq end)--+@pcrq
              if @bdlb in ('7','8','10')
                --狱内减刑/狱外减刑/减刑释放
                set @jg=@jg+(case when @bdfd='9990' then '减为有期徒刑'+dbo.get_mask_xq(@xq,2,'')+(case when @xf_cs='3' then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end)
                                  when @xq like '99%' then '减为'+dbo.get_mask_xq(@xq,2,'')+(case when dbo.get_mask_xq(@xq,2,'') not like '%徒刑' then '徒刑' else '' end)
                                  when @bdfd<>'' and @bdfd<'100000' then '减刑'+dbo.get_mask_xq(@bdfd,2,'')+(case when @xf_cs in ('2','3') then ',刑期'+dbo.get_mask_xq(@xq,2,'') else '' end)+(case when @xf_cs='3' then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end)
                                  when @bdfd>='100000' and @bdfd not like '99%' and @xq_ori like '99%' then '减为有期徒刑'+dbo.get_mask_xq(@xq,2,'')+(case when @xf_cs='3' then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end)
                                  when @bdfd<>'' then '减刑'+dbo.get_mask_xq(@bdfd,2,'')+(case when @xf_cs in ('2','3') then ',刑期'+dbo.get_mask_xq(@xq,2,'') else '' end)+(case when @xf_cs='3' then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end)
                                  else '减刑,减刑后刑期'+dbo.get_mask_xq(@xq,2,'')+(case when @xf_cs='3' then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end) end)
              else if @bdlb in ('4','5','6')
                --狱内加刑/狱外加刑/余罪加刑
                set @jg=@jg+(case when @bdlb='6' then '因余罪' else '' end)+
                            (case when @xq like '99%' then '加刑至'+dbo.get_mask_xq(@xq,2,'')
                                  when @bdfd<>'' then '加刑'+dbo.get_mask_xq(@bdfd,2,'')+(case when @xf_cs in ('2','3') then ',刑期'+dbo.get_mask_xq(@xq,2,'') else '' end)+(case when @xf_cs='3' then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end)
                                  else '加刑,加刑后刑期'+dbo.get_mask_xq(@xq,2,'')+(case when @xf_cs='3' then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end) end)
              else if @bdlb in ('1','2','3')
                --改判、解回重新判决
                set @jg=@jg+(case when @bdlb='1' then '判决' when @bdlb='2' then '改判' else '解回重新判决' end)+',刑期'+dbo.get_mask_xq(@xq,2,'')+(case when @xf_cs='3' then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end)
              else if @bdlb in ('20','21')
                --止日顺延、刑罚合并
                set @jg=@jg+dbo.get_mc('1Q',@bdlb)+',刑期'+dbo.get_mask_xq(@xq,2,'')+(case when @xf_cs='3' then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end)
              else if @bdlb in ('11','12','14','15','16')
                --赦免释放/免刑释放/无罪释放/假释/处决
                set @jg=@jg+dbo.get_mc('1Q',@bdlb)
              else if @bdlb='13'
                --改判释放
                set @jg=@jg+'改判释放,改判刑期'+dbo.get_mask_xq(@xq,2,'')
              else
                --其他刑罚变动类别
                set @jg=@jg+dbo.get_mc('1Q',@bdlb)+',刑期'+dbo.get_mask_xq(@xq,2,'')+(case when @xf_cs='3' and not (@qr is null or @zr is null) then ',自'+dbo.get_mask_date(@qr,2,4)+'至'+dbo.get_mask_date(@zr,2,4) else '' end)
              set @xq_ori=@xq
            end
          else
            begin
              set @have_jc='1'
              set @jg=@jg+(case when @ori_lb='XFBD' then '，'+char(10) else '' end)+@pcrq+dbo.get_mc(@lb,@bdlb)
              set @ori_lb=@lb
              set @n=@n+1
              if @n=@row_rec_num
                begin
                  set @jg=@jg+char(10)
                  set @n=0
                end
              else
                set @jg=@jg+'，'
            end
          
          fetch cur into @lb,@pcrq,@bdlb,@bdfd,@xq,@qr,@zr
        end
      close cur
      deallocate cur
      
      if @have_xf='0'
        set @jg='无加减刑记录'+char(10)+@jg
      if @have_jc='0'
        set @jg=@jg+(case when right(@jg,1)=char(10) then '' else char(10) end)+'无狱政奖惩' 
      else if right(@jg,1)='，'
        set @jg=left(@jg,len(@jg)-1)
   end
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_cb_zxxq]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--返回“实际执行刑期”或“已服刑期”， 返回值格式：“120604” (若有错误数据无法计算的，返回空串)
--用于《释放证明书》 、《假释证明书》、条件检索

--select top 100 dbo.get_cb_zxxq(zf_id,'1','1','1',NULL,'2') from zf_jbxx

CREATE FUNCTION [dbo].[get_cb_zxxq]
(
@zf_id varchar(50),
@qslx_yq varchar(1),    --原判有期徒刑起算日期类型(1原判起日  2羁押日期)
@qslx_wq varchar(1),    --原判无期起算日期类型    (1原判起日  2羁押日期  3终审判决日期  4执行通知书下达日期)
@qslx_sh varchar(1),    --原判死缓起算日期类型    (1原判起日  2羁押日期  3终审判决日期  4执行通知书下达日期)
@jzrq datetime,         --截止日期（《刑满释放证明书》此参数为NULL，由程序中取离监日期或刑期止日作为截止日期；计算“已服刑期”或“实际执行刑期”时必须传入此参数）
@cs varchar(2)          --参数 1:刑满释放证明书  2:假释证明书 或 按起算日期及截止日期计算已服刑期
) 
RETURNS varchar(10)
AS  
BEGIN
  declare @jg    varchar(10),
          @jyrq  datetime,  --羁押日期
          @dbrq  datetime,  --逮捕日期
          @ypxq  varchar(6),--原判刑期
          @pjrq  datetime,  --原判决日期
          @ypqr  datetime,  --原判起日
          @zr    datetime,  --现止日
          @zxrq  datetime,  --执行通知书下达日期
          @zybz  char(1),   --在押标志
          @oid   varchar(50)

  --读取 羁押日期、逮捕日期，原判刑期、原判起日、原判决日期、执行通知书下达日期、在押标志
  select @jyrq=a.jyrq,@dbrq=a.dbrq,@ypxq=isnull(b.xq,''),@ypqr=b.qr,@pjrq=b.pcrq,@zxrq=b.zxrq,@zybz=a.zybz
    from zf_jbxx a join zf_xfzb b on a.zf_id=b.zf_id and b.iszs='1' where a.zf_id=@zf_id
  
  --读取 现止日
  select @zr=zr from zf_xfzb where zf_id=@zf_id and flag='1'

  if @cs='1' and not exists (select 1 from zf_xfzb where zf_id=@zf_id and (xq like '99%' or bdlb in ('4','5','6','15')))
    --释放证明书 (没有无期、死缓、加刑、假释记录)，取最后的刑期作为“实际执行刑期”
    begin
      select @jg=isnull(xq,'') from zf_xfzb where zf_id = @zf_id and flag='1'
      return @jg
    end
  
  declare @gp_qr datetime,  --改判起日（刑罚变动中“改判”或“裁定”记录的起日）
          @qslx int,        --起算类型
          @qsrq  datetime,  --起算日期
          @rq_1  datetime,  --临时变量
          @rq_2  datetime,  --临时变量
          @day   int,       --止日顺延天数+监外执行脱管天数+假释收监的假释期间的天数+脱逃天数
          @in_jzrq int      --是否是程序中确定的截止日期
      
  --将“改判”、“裁定”记录的起日存入变量
  set @gp_qr=(select min(qr) from zf_xfzb where zf_id=@zf_id and bdlb in ('2','3','13','99') and qr is not null)  --2改判  3重新判决  13改判释放  99其它裁定
      
  --若改判起日小于原判起日，将原判起日调整为改判起日
  if @gp_qr<@ypqr
    set @ypqr=@gp_qr
  
  --该罪犯的起算类型变量赋值
  set @qslx=(case when @ypxq='9995' then @qslx_wq when @ypxq='9996' then @qslx_sh else @qslx_yq end)
      
  --确定实际执行刑期的起算日
  if @qslx=2  --起算类型为“羁押日期”
    set @qsrq=(case when @jyrq is not null then @jyrq  --羁押日期
                    when @ypqr is not null then @ypqr  --原判起日
                    when @dbrq is not null then @dbrq  --逮捕日期
                    when @pjrq is not null then @pjrq  --判决日期
                    else @zxrq end)            --下达日期
  else if @qslx=3  --起算类型为“判决日期”
    set @qsrq=(case when @pjrq is not null then @pjrq  --判决日期
                    when @ypqr is not null then @ypqr  --原判起日
                    when @jyrq is not null then @jyrq  --羁押日期
                    when @dbrq is not null then @dbrq  --逮捕日期
                    else @zxrq end)            --下达日期
  else if @qslx=4  --起算类型为“执行通知书下达日期”
    set @qsrq=(case when @zxrq is not null then @zxrq  --下达日期
                    when @ypqr is not null then @ypqr  --原判起日
                    when @jyrq is not null then @jyrq  --羁押日期
                    when @dbrq is not null then @dbrq  --逮捕日期
                    else @pjrq end)            --判决日期
  else   --@qslx=1 起算类型为“原判起日”
    set @qsrq=(case when @ypqr is not null then @ypqr  --原判起日
                    when @jyrq is not null then @jyrq  --羁押日期
                    when @dbrq is not null then @dbrq  --逮捕日期
                    when @pjrq is not null then @pjrq  --判决日期
                    else @zxrq end)            --下达日期

  set @day=0
  
  --检查是否有“止日顺延”记录
  set @rq_1=(select max(zxrq) from zf_xfzb where zf_id=@zf_id and bdlb='20')
  if isdate(@rq_1)=1
    --有“止日顺延”记录，计算顺延天数
    select @day=@day+cast(bdfd as int) from zf_xfzb where zf_id=@zf_id and bdlb='20' and isnumeric(bdfd)=1
  else
    --无“止日顺延”记录
    set @rq_1='19500101'
      
  --判断“止日顺延”之后是否有监外执行脱管记录
  while exists (select 1 from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zf_id=@zf_id and tgqr>@rq_1)
    begin
      --遍历各次监外执行脱管起日、止日
      select top 1 @rq_1=tgqr,@rq_2=tgzr,@oid=a.oid from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zf_id=@zf_id and tgqr>@rq_1 order by tgqr
      if isdate(@rq_2)=1 and @rq_2>@rq_1
        --有脱管起止日，累加脱管天数
        set @day=@day+datediff(dd,@rq_1,@rq_2)
      else if isdate(@rq_1)=1 and isdate(@rq_2)=0
        begin
          --有脱管起日，无脱管止日，判断是否已收监，若已收监，将收监日期作为脱管止日
          set @rq_2=(select top 1 zzrq from zf_jwzx where oid=@oid and zzrq>@rq_1 order by zzrq)
          if isdate(@rq_2)=1
            --有收监日期，计算脱管天数
            set @day=@day+datediff(dd,@rq_1,@rq_2)
          else
            begin
              --未收监，将脱管起日-1作为计算实际刑期的截止日期
              set @jzrq=dateadd(dd,-1,@rq_1)
              set @in_jzrq=1  --程序内确定的截止日期
              break
            end
        end
    end
      
  --检查是否有“假释收监”情况,若有，计算假释期间的天数（按假释期间不计入实际刑期计算）
  set @rq_1='19500101'
  set @rq_2=null
  while exists (select 1 from zf_crj where zf_id=@zf_id and ljrq>@rq_1 and ljlb='15')
    begin
      --读取假释离监日期
      select @rq_1=min(ljrq) from zf_crj where zf_id=@zf_id and ljrq>@rq_1 and ljlb='15'
      --读取假释收监日期
      select @rq_2=min(syrq) from zf_crj where zf_id=@zf_id and syrq>@rq_1 and sylb='3'
      if isdate(@rq_1)=1 and isdate(@rq_2)=1 and @rq_2>@rq_1
        --有收监日期，累加假释天数
        set @day=@day+datediff(dd,@rq_1,@rq_2)
    end
      
  --检查是否有“脱逃记录”记录,若有，计算在逃天数
  if exists (select 1 from zc_tt where zf_id=@zf_id)
    begin
      select @day=@day+datediff(dd,ttrq,bhrq) from zc_tt where zf_id=@zf_id and ttrq is not null and bhrq>ttrq
      --检查是否有尚未捕回记录，若有，将脱逃日期-1作为计算实际刑期的截止日期
      set @rq_1=(select top 1 ttrq from zc_tt where zf_id=@zf_id and bhrq is null order by ttrq)
      if isdate(@rq_1)=1
        begin
          set @jzrq=dateadd(dd,-1,@rq_1)
          set @in_jzrq=1  --程序内确定的截止日期
        end
    end
      
  if @day>0  --起算日期后延
    set @qsrq=@qsrq+@day

  --处理截止日期
  if @jzrq is null
    begin
      --刑满释放证明书，截止日期为：离监的取实际离监日期，在押的取刑期止日
      if @zybz='3'
        --已离监
        select @jzrq=ljrq from zf_crj where zf_id=@zf_id and GYDW_FLAG='1' --取离监日期作为截止日期
      else
        --在押
        set @jzrq=@zr   --取止日作为截止日期
    end
  else if @jzrq is not null and @in_jzrq=0
    begin
      --截止日期参数不空 且 不是程序内确定的截止日期
      if @zybz='3'
        --已离监
        select @jzrq=ljrq from zf_crj where zf_id=@zf_id and GYDW_FLAG='1' --取离监日期作为截止日期
      else
        --在押，判断截止日期若大于刑期止日，取刑期止日为截止日期
        if @jzrq>@zr
          select @jzrq=@zr  --取止日作为截止日期
    end
        
  if @jzrq<=@qsrq
    return ''
      
  --形成实际执行刑期字串(格式：120100)
  set @jg=dbo.get_sjjg(@qsrq,@jzrq)
  
  return  @jg
END



GO
/****** Object:  UserDefinedFunction [dbo].[get_cb_zyjwzxqx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回最后一次监外执行的信息，用于暂于监外执行不计入刑期中的“暂于监外执行情形”
--select dbo.get_cb_zyjwzxqx(zf_id) from zf_jbxx a where zybz='1' and exists (select 1 from zf_jwzx b join zf_jwzx_tg c on b.oid=c.zf_jwzx_oid where b.zf_id=a.zf_id)

CREATE function [dbo].[get_cb_zyjwzxqx]
(
 @zf_id varchar(50)
)
returns varchar(2000)
as
begin
  declare @jg varchar(2000),@cr varchar(2),@zxlb varchar(2),@xblb varchar(2),@pzrq datetime,@xbrq datetime,
          @bwyy varchar(2000),@bwnx varchar(6),@jwzx_oid varchar(50),@zzrq datetime,@zzlb varchar(3),
          @sjbm varchar(3)
  set @jg=''
  set @cr=char(13)+char(10)
  
  select top 1 @jwzx_oid=a.oid,@zxlb=a.zxlb,@pzrq=a.pzrq,@bwyy=ltrim(isnull(a.bwyy,'')),@bwnx=isnull(a.bwnx,''),
               @zzrq=a.zzrq,@zzlb=isnull(a.zzlb,''),@sjbm=b.sjbm
   from zf_jwzx a left join pub_dmb b on a.zzlb=b.bm and b.lb='1S' where a.zf_id=@zf_id order by a.pzrq desc
  
  if @zxlb='1'
    --执行类别为保外就医
    begin
      if @bwyy<>''
        begin
          set @bwyy=replace(replace(@bwyy,char(10),''),char(13),'')  --去掉保外原因中的回车换行符号
          while right(@bwyy,1) in ('。','，','；','.',',',';')  --去掉最后的标点符号
            begin
              set @bwyy=left(@bwyy,len(@bwyy)-1)
            end
          set @bwyy=(case when left(@bwyy,1)='因' then '' else '因' end)+@bwyy+'，'
        end
      set @jg=@bwyy+'于'+dbo.get_mask_date(@pzrq,2,4)+'批准保外就医，期限'+
              (case when @bwnx like '99%' or @bwnx='' then '至刑满' else dbo.get_mask_xq(@bwnx,2,'') end)
    end
  else if @zxlb is not null
    set @jg='因'+dbo.get_mc('1T',@zxlb)+'批准监外执行，期限'+
            (case when @bwnx like '99%' or @bwnx='' then '至刑满' else dbo.get_mask_xq(@bwnx,2,'') end)
  
  --读取首次续保的批准日期
  set @xbrq=null
  select top 1 @xbrq=pzrq from zf_jwzx_xb  where zf_jwzx_oid=@jwzx_oid order by pzrq
  if @xbrq is not null
    --有续保记录，附加续保情况
    begin
      set @jg=@jg+'；'+@cr
      --建立续保记录游标
      declare cur cursor for
        select zxlb,pzrq,ltrim(isnull(xbyy,'')),isnull(xbnx,'')
          from zf_jwzx_xb where zf_jwzx_oid=@jwzx_oid order by pzrq
      open cur
      fetch cur into @xblb,@pzrq,@bwyy,@bwnx
      while @@fetch_status=0
	      begin
          if @bwyy<>''
            begin
              set @bwyy=replace(replace(@bwyy,char(10),''),char(13),'')  --去掉回车换行符号
              while right(@bwyy,1) in ('。','，','；','.',',',';')  --去掉最后的标点符号
                begin
                  set @bwyy=left(@bwyy,len(@bwyy)-1)
                end
            end
          set @jg=@jg+dbo.get_mask_date(@pzrq,2,4)
          if @xblb=@zxlb
            set @jg=@jg+'批准续保'+(case when @bwnx like '99%'or @bwnx='' then ',期限：至刑满' else dbo.get_mask_xq(@bwnx,2,'') end)+
                    (case when @bwyy=''then '' else '，批准原因:'+@bwyy end)+'；'+@cr
          else
            begin
              if @xblb='1'
                set @jg=@jg+'批准保外就医'+(case when @bwyy='' then '' else '，原因：'+@bwyy end)+'，期限'+
                   (case when @bwnx like '99%' or @bwnx='' then '至刑满' else dbo.get_mask_xq(@bwnx,2,'') end)+'；'+@cr
              else
                set @jg=@jg+'批准监外执行，原因：'+dbo.get_mc('1T',@zxlb)+'，期限'+
                   (case when @bwnx like '99%' or @bwnx='' then '至刑满' else dbo.get_mask_xq(@bwnx,2,'') end)+'；'+@cr
            end
          set @zxlb=@xblb
          fetch cur into @xblb,@pzrq,@bwyy,@bwnx
	      end
      close cur
      deallocate cur
    end
    
    if @jg<>''
      begin
        --去掉字串最后的标点符号
        while right(@jg,1)=char(10) or right(@jg,1)=char(13) or right(@jg,1) in ('；','。')
          begin
            set @jg=left(@jg,len(@jg)-1)
          end
      end
    
  if @zzrq is not null
    --保外终止情况
    set @jg=@jg+(case when @xbrq is null then '，' else '。'+@cr end)+dbo.get_mask_date(@zzrq,2,4)+
           (case when @zzlb in ('5','6','7','8') or @sjbm in ('5','6','7','8') then '因' else '' end)+dbo.get_mc('1S',@zzlb)+'。'+@cr
  else
    --保外未终止
    set @jg=@jg+(case when @jg='' then '' else '。'+@cr end)
    
    --判断是否有脱管记录
    if exists (select 1 from zf_jwzx_tg where zf_jwzx_oid=@jwzx_oid)
      begin
        declare @tgqr datetime,     --脱管起日
                @tgzr datetime,     --脱管止日
                @lhdw varchar(160), --脱管来函单位
                @ghzh varchar(80),  --脱管公函字号
                @lhrq datetime,     --脱管来函日期
                @sslhdw varchar(160), --收审来函单位
                @ssghzh varchar(80),  --收审公函字号
                @sslhrq datetime      --收审来函日期
        
        declare cur cursor for
          select tgqr,tgzr,dbo.get_qhmx(lhqh,lhmx),ghzh,lhrq
            from zf_jwzx_tg where zf_jwzx_oid=@jwzx_oid order by tgqr
        open cur
        fetch cur into @tgqr,@tgzr,@lhdw,@ghzh,@lhrq
        while @@fetch_status=0
	        begin
            if @tgzr is null
              --脱管止日空，判断是否有收审记录，若有，将收审起日作为脱管止日
              select top 1 @tgzr=ssqr,@sslhdw=dbo.get_qhmx(lhqh,lhmx),@ssghzh=ghzh,@sslhrq=lhrq
                from zf_jwzx_ss where zf_jwzx_oid=@jwzx_oid and ssqr>=@tgqr order by ssqr
            set @jg=@jg+dbo.get_mask_date(@lhrq,2,4)+
                    (case when @lhdw='' then '' else @lhdw+'来函'+(case when @ghzh='' then '(公函字号：'+@ghzh+')' else '' end)+'告知该罪犯' end)+
                    '于'+dbo.get_mask_date(@tgqr,2,4)+(case when @tgzr is null then '' else '至'+dbo.get_mask_date(@tgzr,2,4) end)+'脱管。'
            fetch cur into @tgqr,@tgzr,@lhdw,@ghzh,@lhrq
	        end
        close cur
        deallocate cur
      end
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_db]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   FUNCTION [dbo].[get_db]
(
 @zf_id varchar(50),   @jzrq datetime,    @dwjb varchar(2),  @cs varchar(2)    )                  returns varchar(20)
as
begin
  declare @jg varchar(20),@bs_bm char(2)
  
  if @jzrq is null
        begin
      if @cs='11'
                select @jg=a.gysf from zf_jbxx a where a.zf_id=@zf_id
      else if @cs='12'
                select @jg=a.gydw from zf_jbxx a where a.zf_id=@zf_id
      else if @cs='13'
                select @jg=a.gyjq from zf_jbxx a where a.zf_id=@zf_id
      else if @cs='2'
                select @jg=gydw+isnull(gyjq,'') from zf_jbxx where zf_id=@zf_id
      else if @cs='3'
                select @jg=gysfj from zf_jbxx a where a.zf_id=@zf_id
    end
  else
        begin
      if @cs='11'
                select top 1 @jg=gysf from zf_crj where zf_id=@zf_id and (ljrq is null or ljrq>@jzrq) 
				order by (case when ljrq is null then '99991231' else ljrq end),cjsj desc
      else if @cs='12'
                select top 1 @jg=gydw from zf_crj where zf_id=@zf_id and (ljrq is null or ljrq>@jzrq) 
				order by (case when ljrq is null then '99991231' else ljrq end),cjsj desc
      else if @cs='13'
                select top 1 @jg=b.hgyjqbm
          from zf_crj a join zf_jqdd b on a.zf_id=b.zf_id and b.oid=(select top 1 oid from zf_jqdd 
		  where zf_id=a.zf_id and pzrq<=@jzrq and vaild_flag='Y' order by pzrq desc,cjsj desc)
          where a.zf_id=@zf_id and (a.ljrq is null or a.ljrq>@jzrq)
          order by (case when a.ljrq is null then '99991231' else a.ljrq end),a.cjsj desc
      else if @cs='2'
                select top 1 @jg=a.gydw+b.hgyjqbm
          from zf_crj a join zf_jqdd b on a.zf_id=b.zf_id and b.oid=(select top 1 oid from zf_jqdd 
		  where zf_id=a.zf_id and pzrq<=@jzrq and vaild_flag='Y' order by pzrq desc,cjsj desc)
          where a.zf_id=@zf_id and (a.ljrq is null or a.ljrq>@jzrq)
          order by (case when a.ljrq is null then '99991231' else a.ljrq end),a.cjsj desc
      else if @cs='3'
                select top 1 @jg=gysfj from zf_crj where zf_id=@zf_id and (ljrq is null or ljrq>@jzrq) 
				order by (case when ljrq is null then '99991231' else ljrq end),cjsj desc
    end

  return isnull(@jg,'')
end
GO
/****** Object:  UserDefinedFunction [dbo].[get_db_rs]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回某监区/某监狱/某省押犯数
--select dbo.get_db_rs('','20111231','5','4501','0')

CREATE  function [dbo].[get_db_rs]
(
 @bms varchar(500),   --空：按用户单位级别统计本单位押犯总数   监区编码/监狱编码/省份编码：统计指定单位押犯数 （可传多个监区编码，格式：1,2,3  监狱/省份编码只允许一个）
 @jzrq datetime,      --截止日期（NULL表示当前日期）
 @dwjb varchar(2),    --用户单位级别：1司法部  2部属监狱  3省局  4分局  5省属监狱  6分局下属监狱  7市属监狱
 @dwbm varchar(6),    --用户单位编码(司法部 省局  分局 监狱单位编码)
 @cs varchar(2)       --统计结果为0时返回值 0：返回0   其它：返回NULL(用于计算百分比时作为分母)
)
returns int
as
begin
  declare @jg int,@sql nvarchar(500),@s_jzrq varchar(8),@dw_num tinyint,@bs_bm char(2)
  set @jg=0
  set @dw_num=1   --是否统计多个单位:1为个单位  2为多个单位（默认1个单位）
  
  if @bms='all' or isnull(@bms,'')=''
    set @bms=''
  else
    begin
      if @bms like '%,%'
        begin
          set @dw_num=2
          if @bms not like ',%,'
            set @bms=','+@bms+','
        end
    end
  
  if @jzrq is null
    begin
      --无截止日期
      if @bms=''
        --查询范围为全部
        begin
          if @dwjb in ('1','3')
            --司法部、省局  统计当前押犯总数
            select @jg=count(*) from zf_jbxx where zybz='1'
          else if @dwjb='4'
            --分局  统计该分局当前押犯总数
            select @jg=count(*) from zf_jbxx a join pub_jyxx b on a.gydw=b.dwdm and b.sjdm=@dwbm where a.zybz='1' and gysfj=@dwbm
          else
            --监狱  统计该监狱当前押犯总数
            select @jg=count(*) from zf_jbxx where zybz='1' and gydw=@dwbm
        end
      else
        --查询范围不是全部
        begin
          if @dwjb='1'
            --司法部 统计某省押犯数
            select @jg=count(*) from zf_jbxx where zybz='1' and gysf=@bms
          else if @dwjb='3' or @dwjb='4'
            --省局/分局 统计某监狱押犯数
            select @jg=count(*) from zf_jbxx where zybz='1'  and gydw=@bms
          else
            --监狱 统计本监狱某监区押犯数
            begin
              if @dw_num=1
                select @jg=count(*) from zf_jbxx where zybz='1' and gydw=@dwbm and gyjq=@bms
              else
                select @jg=count(*) from zf_jbxx where zybz='1' and gydw=@dwbm and charindex(','+gyjq+',',@bms)>0
            end
        end
    end
  else
    --有截止日期
    begin
      if @bms=''
        --查询范围为全部
        begin
         if @dwjb='1'
           --用户为司法部  统计截止日期时押犯总数
             select @jg=count(*) from zf_jbxx a
               where exists (select 1 from zf_crj where zf_id=a.zf_id and (ljrq is null or ljrq>@jzrq))
          else if @dwjb='3'
            --用户为省局  统计截止日期时该省局押犯总数
            begin
              set @bs_bm=left(@dwbm,2)  --本省编码
              select @jg=count(*) from zf_jbxx a
                where exists (select 1 from zf_crj where zf_id=a.zf_id and gysf=@bs_bm and (ljrq is null or ljrq>@jzrq))
            end
          else if @dwjb='4'
            --用户为分局  统计截止日期时该分局押犯总数
              select @jg=count(*) from zf_jbxx a
                where exists (select 1 from zf_crj where zf_id=a.zf_id and gysfj=@dwbm and (ljrq is null or ljrq>@jzrq))
          else
            --用户为监狱  统计截止日期时该监狱押犯总数
              select @jg=count(*) from zf_jbxx a
                where exists (select 1 from zf_crj where zf_id=a.zf_id and gydw=@dwbm and (ljrq is null or ljrq>@jzrq))
        end
      else
        --查询范围不是全部
        begin
          if @dwjb='1'
            --用户为司法部  统计截止日期时某省押犯数
            select @jg=count(*) from zf_jbxx a
              where exists (select 1 from zf_crj where zf_id=a.zf_id and (ljrq is null or ljrq>@jzrq))
          else if @dwjb in ('3','4')
            --用户为省局/分局  统计截止日期时某监狱押犯数
            select @jg=count(*) from zf_jbxx a
             where exists (select 1 from zf_crj where zf_id=a.zf_id and gydw=@bms and (ljrq is null or ljrq>@jzrq))
          else
            --监狱 统计监区押犯数
            begin
              if @dw_num=1
--declare @jzrq datetime,@dwbm char(4),@bms varchar(4)
--set @jzrq='20121231'
--set @dwbm='1146'
--set @bms='7'
                
                select @jg=count(*)
                  from zf_jbxx a join zf_crj b on a.zf_id=b.zf_id and b.oid=(select top 1 oid from zf_crj where zf_id=a.zf_id and gydw=@dwbm and (ljrq is null or ljrq>@jzrq) order by (case when ljrq is null then '99991231' else ljrq end) desc) 
                                 join zf_jqdd c on b.zf_id=c.zf_id and c.oid=(select top 1 oid from zf_jqdd where zf_id=b.zf_id and pzrq<=@jzrq and vaild_flag='Y' order by pzrq desc,cjsj desc)
                  where c.hgyjqbm=@bms

--                select @jg=count(*)
--                  from (select a.zf_id,b.gydw from zf_jbxx a join zf_crj b on a.zf_id=b.zf_id and b.oid=(select top 1 oid from zf_crj where zf_id=a.zf_id and (b.ljrq is null or b.ljrq>@jzrq) order by (case when ljrq is null then '99991231' else ljrq end) desc)) aa
--                                 join zf_jqdd c on aa.zf_id=c.zf_id and c.oid=(select top 1 oid from zf_jqdd where zf_id=aa.zf_id and pzrq<=@jzrq and vaild_flag='Y' order by pzrq desc,cjsj desc)
--                  where aa.gydw=@dwbm and c.hgyjqbm=@bms

              else
                select @jg=count(*)
                  from zf_jbxx a join zf_crj b on a.zf_id=b.zf_id and b.oid=(select top 1 oid from zf_crj where zf_id=a.zf_id and gydw=@dwbm and (ljrq is null or ljrq>@jzrq) order by (case when ljrq is null then '99991231' else ljrq end) desc) 
                                 join zf_jqdd c on a.zf_id=c.zf_id and c.oid=(select top 1 oid from zf_jqdd where zf_id=a.zf_id and pzrq<=@jzrq and vaild_flag='Y' order by pzrq desc,cjsj desc)
                  where charindex(','+c.hgyjqbm+',',@bms)>0
            end
        end
    end
  if @jg=0
    set @jg=(case when @cs='0' then 0 else NULL end)
  
  return @jg
end


GO
/****** Object:  UserDefinedFunction [dbo].[get_db_xsy]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回罪犯新收押时的接收省份/接收监狱单位编码
--select top 1000 dbo.get_db_xsy(zf_id,'3') from zf_jbxx a where zybz='1'

CREATE function [dbo].[get_db_xsy]
(
 @zf_id varchar(50),  --罪犯ID
 @dwjb  varchar(2)    --单位级别
)
returns varchar(6)
as
begin
  declare @gydw varchar(6)
  set @gydw=''
  
  --读取首次调动的“调动前关押单位”
  if @dwjb='1'
    --司法部  返回省份
    select top 1 @gydw=left((case when (qgyjybm='' or qgyjybm is null) then hgyjybm else qgyjybm end),2)
      from zf_jqdd where zf_id=@zf_id order by pzrq,cjsj
  else
    --省局、分局   返回监狱编码
    select top 1 @gydw=(case when qgyjybm='' or qgyjybm is null then hgyjybm else qgyjybm end)
      from zf_jqdd where zf_id=@zf_id order by pzrq,cjsj
  
  if @gydw='' or @gydw is null
    --读取基本信息表的关押单位
    select @gydw=(case when @dwjb='1' then gysf else gydw end) from zf_jbxx where zf_id=@zf_id
  
  return @gydw
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_dmjqoid]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[get_dmjqoid]
(
  @dwdm varchar(50),
  @dmbm varchar(50)
)
returns varchar(50)
as
begin
  declare @dmjqoid varchar(50)
  select  @dmjqoid=BMJQ.OID from dbo.PUB_BMJQ as BMJQ, dbo.PUB_JYXX as JYXX

   where BMJQ.PUB_JYXX_OID=JYXX.OID and JYXX.DWDM=@dwdm and BMJQ.BM=@dmbm

  return @dmjqoid
end

--select dbo.[get_dmjqoid] ('1103','1')
GO
/****** Object:  UserDefinedFunction [dbo].[get_ffzz]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回非法组织信息
--select dbo.get_ffzz(zf_id,'1','') from zf_ffzz

CREATE  function [dbo].[get_ffzz]
(
 @zf_id varchar(50),
 @cs varchar(2),     --返回值形式参数：1组织名称+在组织中作用  
 @dwbm varchar(6)    --用户单位编码（预留参数，用于用户特殊需求）
)
returns varchar(100)
as
begin
  declare @jg varchar(100)
  set @jg=''
  
  if @cs='1' or isnull(@cs,'')=''
    --返回组织名称+在组织中作用
    select @jg=@jg+(case when @jg='' then '' else '、' end)+(case when zzmc<>'' then zzmc else dbo.get_mc('46',zzlx) end)+
                   (case when zzzy in ('1','2','3') then '('+dbo.get_mc('47',zzzy)+')'  else '' end)
       from zf_ffzz where zf_id=@zf_id order by xh
  
  return @jg
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_fgdj]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--按截止日期返回分管等级编码
--select top 100 dbo.get_fgdj(zf_id,null,'1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_fgdj]
(
 @zf_id varchar(50),
 @jzrq datetime    --截止日期(传NULL 表示当前日期)
)
returns varchar(6)
as
begin
  declare @jg varchar(6)

  if @jzrq is null
    select @jg=hfgdj from zf_fgdj where zf_id=@zf_id and flag='1'
  else
    select top 1 @jg=hfgdj from zf_fgdj where zf_id=@zf_id and (pzrq<=@jzrq or pzrq is null) and vaild_flag='Y' order by pzrq desc,cjsj desc
  
  if @jg is null
    set @jg=''

  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_fjx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回附加刑
--select top 1000 dbo.get_fjx(zf_id,null) from zf_jbxx where zybz='1'

CREATE FUNCTION [dbo].[get_fjx]
(
@zf_id varchar(50),  --罪犯ID
@jzrq datetime       --截止日期
)
RETURNS varchar(100)
AS  
BEGIN
  declare @jg varchar(100),@bznx varchar(6),@mscc varchar(500),@fjljje decimal(14,2),@qzcj tinyint
  set @jg=''
  
  if @jzrq is null
    --无截止日期  读取当前附加刑
    begin
      --读取剥政年限、是否驱逐出境
      select top 1 @bznx=bznx,@qzcj=qzcj from zf_xfzb where zf_id=@zf_id and flag='1'
      --读取罚金累计金额
      select top 1 @fjljje=b.fjljje
        from zf_xfzb a join zf_xfzb_fb b on a.oid=b.zf_xfzb_oid
        where a.zf_id=@zf_id
        order by a.pcrq desc,a.cjsj desc
      --读取没收财产(若有改判，以改判为准)
      select top 1 @mscc=mscc
        from zf_xfzb a join zf_xfzb_fb b on a.oid=b.zf_xfzb_oid
        where a.zf_id=@zf_id and (a.iszs='1' or a.bdlb='2')
        order by a.pcrq desc,a.cjsj desc
    end  
  else
    --有截止日期  读取截止日期时的附加刑
    begin
      --读取剥政年限、是否驱逐出境
      select top 1 @bznx=bznx,@qzcj=qzcj from zf_xfzb where zf_id=@zf_id and pcrq<=@jzrq order by pcrq desc,cjsj desc
      --读取罚金累计金额
      select top 1 @fjljje=fjljje
        from zf_xfzb a join zf_xfzb_fb b on a.oid=b.zf_xfzb_oid
        where a.zf_id=@zf_id and a.pcrq<=@jzrq
        order by a.pcrq desc,a.cjsj desc
      --读取没收财产(若有改判，以改判为准)
      select top 1 @mscc=mscc
        from zf_xfzb a join zf_xfzb_fb b on a.oid=b.zf_xfzb_oid
        where a.zf_id=@zf_id and a.pcrq<=@jzrq and (a.iszs='1' or a.bdlb='2')
        order by a.pcrq desc,a.cjsj desc
    end
   
  --生成附加刑串
  set @jg=dbo.get_mask_fjx(@bznx,@mscc,@fjljje,@qzcj,'1')
  
  return @jg
END



GO
/****** Object:  UserDefinedFunction [dbo].[get_gydw]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回“所在监狱及监区名称”  (用于含有“关押单位GYDW”“监狱名称JYMC”“关押监区GYJQ”3个字段的表此3个字段的输出)
--select top 1000 dbo.get_gydw(gydw,jymc,gyjq,'4','4401') from zf_fgdj

CREATE function [dbo].[get_gydw]
(
 @gydw varchar(4),   --关押单位编码
 @jymc varchar(60),  --监狱名称(可空)
 @gyjq varchar(6),   --监区编码
 @dwjb varchar(6),   --用户单位级别
 @dwbm varchar(4)    --用户单位编码
)
returns varchar(100)
as
begin
  if isnull(@gydw,'')=''
    return ''
  
  declare @jg varchar(100),@s varchar(40)
  set @jg=''
  
  if @dwjb='1'
    --司法部
    select @jg=mc from pub_dmb where lb='1U' and bm=@gydw
  else if @dwjb in ('3','4')
    --省局、分局
    begin
      if left(@gydw,2)=left(@dwbm,2)
        --所在单位为本省监狱编码，返回监狱名称+监区名称
        select @jg=a.dwmc+isnull(b.mc,'')
          from pub_jyxx a left join pub_bmjq b on a.oid=b.pub_jyxx_oid and b.bm=@gyjq
          where a.dwdm=@gydw
      else
        --所在单位为外省监狱局或外省监狱编码，返回监狱名称
        select @jg=mc+(case when @gydw like '%00' then isnull(@jymc,'') else '' end) from pub_dmb where lb='1Z' and bm=@gydw
    end
  else
    --监狱
    begin
      if @gydw=@dwbm
        --所在单位为本监狱编码，返回监区名称
        select @jg=isnull(b.mc,'')
          from pub_jyxx a left join pub_bmjq b on a.oid=b.pub_jyxx_oid and b.bm=@gyjq
          where a.dwdm=@gydw
      else
        --所在单位为本省其它监狱编码、外省监狱局编码、外省监狱编码，返回监狱名称
        select @jg=mc+(case when @gydw like '%00' then isnull(@jymc,'') else '' end) from pub_dmb where lb='1Z' and bm=@gydw
    end
    
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_hjzcy]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回监组成员姓名串(不含罪犯本人) 或 返回该罪犯是否有互监组（1有 0无）
--select top 100 dbo.get_hjzcy(zf_id,'20131231','2','2',gydw) as a from zf_jbxx where zybz='1' order by a desc

CREATE function [dbo].[get_hjzcy]
(
 @zf_id varchar(50),
 @jzrq datetime,     --截止日期（传NULL表示当前日期）
 @cs varchar(6),     --返回值形式  1:返回生活互监组成员姓名串  1A:返回的生活互监组成员姓名后附加说明，如（禁闭） 2:返回劳动互监组成员姓名串  2A:返回的劳动互监组成员姓名后附加说明，如（禁闭）
 @dwjb varchar(4),   --用户单位级别
 @dwbm varchar(4)    --用户单位编码（用于用户特殊需求）
)
returns varchar(500)
as
begin
  declare @jg varchar(500),@sh_hjzh varchar(50),@ld_hjzh varchar(50),@ls_hjzh varchar(50),@gydw varchar(6),@gyjq varchar(6),@gydw_jq varchar(20)
  
  if @jzrq is null or @dwjb in ('1','3','4')
    --无截止日期  读取当前互监组成员  （司法部/省局/分局不提供按截止日期查找互监组功能）
    begin
      if @cs like '1%'
        begin
          --生成生活互监组成员姓名串
          --读取该罪犯生活互监组号
          select  @gydw=a.gydw,   --关押监狱编码
                  @gyjq=a.gyjq,   --关押监区编码
                  @sh_hjzh=b.hjz_oid  --当前生活互监组号
            from zf_jbxx a join zf_shhjzbd b on a.zf_id=b.zf_id and b.flag='1'
            where a.zf_id=@zf_id
			
          if @sh_hjzh<>''
            select @jg=@jg+(case when @jg='' then '' else '、' end)+a.xm+
                           (case when @cs='1A' then 
                           (case when exists (select top 1 1 from sw_jbyl where zf_id=@zf_id and jzlb in ('5','6','7','8') and jzzyrq is not null and cyrq is null) then '(住院)' else '' end)+
                           (case when exists (select top 1 1 from zf_yzcc where zf_id=@zf_id and ccts>0 and cczr is null) then '('+dbo.get_mc('3L',(select top 1 cclb from zf_yzcc where zf_id=a.zf_id and ccts>0 and cczr is null))+')' else '' end)+
                           (case when exists (select top 1 1 from zf_ljtq where zf_id=@zf_id and jqqr is not null and jqzr is null) then '(离监探亲)' else '' end)
                            else '' end)
              from zf_jbxx a join zf_shhjzbd b on a.zf_id=b.zf_id and b.flag='1' 
              where a.zybz='1' and a.gydw=@gydw and a.gyjq=@gyjq and b.hjz_oid=@sh_hjzh and a.zf_id<>@zf_id
                    and not exists (select 1 from zf_jwzx where zf_id=a.zf_id and pzrq is not null and zzrq is null)  --监外执行
                    and not exists (select 1 from zc_tt where zf_id=a.zf_id and ttrq is not null and bhrq is null)    --在逃
                    and not exists (select 1 from zf_jhzs where zf_id=a.zf_id and tjrq is not null and zzrq is null)  --解回再审
        end
      else if @cs like '2%'
        begin
          --劳动互监组成员姓名串
          --读取该罪犯劳动互监组号
          select  @gydw=a.gydw,   --关押监狱编码
                  @gyjq=a.gyjq,   --关押监区编码
                  @ld_hjzh=b.hjz_oid
            from zf_jbxx a join zf_ldhjzbd b on a.zf_id=b.zf_id and b.flag='1'
            where a.zf_id=@zf_id
          if @ld_hjzh<>''
            select @jg=@jg+(case when @jg='' then '' else '、' end)+a.xm+
                           (case when @cs='2A' then 
                           (case when exists (select 1 from sw_jbyl where zf_id=@zf_id and jzlb in ('5','6','7','8') and cyrq is null) then '(住院)' else '' end)+
                           (case when exists (select 1 from zf_yzcc where zf_id=@zf_id and ccts>0 and cczr is null) then '('+dbo.get_mc('3L',(select top 1 cclb from zf_yzcc where zf_id=a.zf_id and ccts>0 and cczr is null))+')' else '' end)+
                           (case when exists (select 1 from zf_ljtq where zf_id=@zf_id and jqqr is not null and jqzr is null) then '(离监探亲)' else '' end)
                            else '' end)
              from zf_jbxx a join  zf_ldhjzbd b on a.zf_id=b.zf_id and b.flag='1'
              where a.zybz='1' and a.gydw=@gydw and a.gyjq=@gyjq and b.hjz_oid=@ld_hjzh and a.zf_id<>@zf_id
                    and not exists (select 1 from zf_jwzx where zf_id=a.zf_id and pzrq is not null and zzrq is null)  --监外执行
                    and not exists (select 1 from zc_tt where zf_id=a.zf_id and ttrq is not null and bhrq is null)    --在逃
                    and not exists (select 1 from zf_jhzs where zf_id=a.zf_id and tjrq is not null and zzrq is null)  --解回再审
        end
    end
  else
    --有截止日期
    begin
      --读取截止日期时互监组成员
      if @cs like '1%'
        begin
          --生活互监组成员姓名串
          --读取该罪犯截止日期时的生活互监组号
          select  @gydw_jq=dbo.get_db(@zf_id,@jzrq,@dwjb,'2'), --关押监狱+监区编码
                  @sh_hjzh=b.hjz_oid                          --当时生活互监组号
            from zf_jbxx a join zf_shhjzbd b on a.zf_id=b.zf_id and b.oid=(select top 1 oid from zf_shhjzbd where zf_id=@zf_id and bdrq<=@jzrq order by bdrq desc,cjsj desc)
            where a.zf_id=@zf_id
			 
         
          if @gydw_jq<>'' and @sh_hjzh<>''
            begin
                select @jg=@jg+(case when @jg='' then '' else '、' end)+t.xm+
                               (case when @cs='1A' then 
                               (case when exists (select 1 from sw_jbyl where zf_id=@zf_id and jzlb in ('5','6','7','8') and jzzyrq<=@jzrq and (cyrq is null or cyrq>@jzrq) and vaild_flag='Y') then '(住院)' else '' end)+
                               (case when exists (select 1 from zf_yzcc where zf_id=@zf_id and pzrq<=@jzrq and ccts>0 and (cczr>@jzrq or cczr is null) and vaild_flag='Y') then '('+dbo.get_mc('3L',(select top 1 cclb from zf_yzcc where zf_id=@zf_id and ccts>0 and cczr is null))+')' else '' end)+
                               (case when exists (select 1 from zf_ljtq where zf_id=@zf_id and jqqr<=@jzrq and (jqzr is null or jqzr>@jzrq) and vaild_flag='Y') then '(离监探亲)' else '' end)
                                else '' end)
                  from (select a.xm,a.zf_id from zf_jbxx a join zf_crj b on a.zf_id=b.zf_id where b.syrq<=@jzrq and (b.ljrq is null or b.ljrq>@jzrq)) t
                        join zf_shhjzbd b on t.zf_id=b.zf_id and b.oid=(select top 1 oid from zf_shhjzbd where zf_id=@zf_id and bdrq<=@jzrq order by bdrq desc,cjsj desc)
                  where dbo.get_db(t.zf_id,@jzrq,@dwjb,'2')=@gydw_jq and b.hjz_oid=@sh_hjzh and t.zf_id<>@zf_id
                        and not exists (select 1 from zf_jwzx where zf_id=@zf_id and zxrq<=@jzrq and (zzrq is null or zzrq>@jzrq))  --当时监外执行
                        and not exists (select 1 from zc_tt where zf_id=@zf_id and ttrq<=@jzrq and (bhrq is null or bhrq>@jzrq))    --当时在逃
                        and not exists (select 1 from zf_jhzs where zf_id=@zf_id and tjrq<=@jzrq and (zzrq is null or zzrq>@jzrq))  --当时解回再审
               return @jg
		    end
        end
      else if @cs like '2%'
        begin
          --劳动互监组成员姓名串
          --读取该罪犯截止日期时的劳动互监组号
          select  @gydw_jq=dbo.get_db(@zf_id,@jzrq,@dwjb,'2'), --关押监狱+监区编码
                  @ld_hjzh=b.hjz_oid                          --当时劳动互监组号
            from zf_jbxx a join zf_ldhjzbd b on a.zf_id=b.zf_id and b.oid=(select top 1 oid from zf_ldhjzbd where zf_id=@zf_id and bdrq<=@jzrq order by bdrq desc,cjsj desc)
            where a.zf_id=@zf_id
          
          if @gydw_jq<>'' and @ld_hjzh<>''
            begin
                select @jg=@jg+(case when @jg='' then '' else '、' end)+t.xm+
                               (case when @cs='2A' then 
                               (case when exists (select 1 from sw_jbyl where zf_id=@zf_id and jzlb in ('5','6','7','8') and jzzyrq<=@jzrq and (cyrq is null or cyrq>@jzrq) and vaild_flag='Y') then '(住院)' else '' end)+
                               (case when exists (select 1 from zf_yzcc where zf_id=@zf_id and pzrq<=@jzrq and ccts>0 and (cczr>@jzrq or cczr is null) and vaild_flag='Y') then '('+dbo.get_mc('3L',(select top 1 cclb from zf_yzcc where zf_id=@zf_id and ccts>0 and cczr is null))+')' else '' end)+
                               (case when exists (select 1 from zf_ljtq where zf_id=@zf_id and jqqr<=@jzrq and (jqzr is null or jqzr>@jzrq) and vaild_flag='Y') then '(离监探亲)' else '' end)
                                else '' end)
                  from (select a.xm,a.zf_id from zf_jbxx a join zf_crj b on a.zf_id=b.zf_id where b.syrq<=@jzrq and (b.ljrq is null or b.ljrq>@jzrq)) t
                        join zf_ldhjzbd b on t.zf_id=b.zf_id and b.oid=(select top 1 oid from zf_ldhjzbd where zf_id=@zf_id and bdrq<=@jzrq order by bdrq desc,cjsj desc)
                  where dbo.get_db(t.zf_id,@jzrq,@dwjb,'2')=@gydw_jq and b.hjz_oid=@ld_hjzh and t.zf_id<>@zf_id
                        and not exists (select 1 from zf_jwzx where zf_id=@zf_id and zxrq<=@jzrq and (zzrq is null or zzrq>@jzrq))  --当时监外执行
                        and not exists (select 1 from zc_tt where zf_id=@zf_id and ttrq<=@jzrq and (bhrq is null or bhrq>@jzrq))    --当时在逃
                        and not exists (select 1 from zf_jhzs where zf_id=@zf_id and tjrq<=@jzrq and (zzrq is null or zzrq>@jzrq))  --当时解回再审
            end
        end
    end
  if @jg is null
    set @jg=''
    
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_hyzk]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--按截止日期返回最新婚姻状况编码
--select top 1000 dbo.get_hyzk(zf_id,null) from zf_jbxx where zybz='1'

CREATE  function [dbo].[get_hyzk]
(
 @zf_id varchar(50),
 @jzrq datetime    --截止日期(传NULL 表示当前日期)
)
returns varchar(10)
as
begin 
  declare @jg varchar(10)
  set @jg=''
  
  if @jzrq is null
    --读取最新婚姻状况
    select top 1 @jg=hyzk from zf_hybd where zf_id=@zf_id and flag='1'
  else
    --读取截止日期前婚姻状况
    select top 1 @jg=hyzk from zf_hybd where zf_id=@zf_id and (rq<=@jzrq or rq is null) and hyzk<>'' order by rq desc
  
  if @jg='' or @jg is null
    --读取捕前婚姻状况
    select @jg=hyzk from zf_jbxx_fb where zf_id=@zf_id
  
  if @jg is null
    set @jg=''
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_is_lbc]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回是否是老病残逻辑值（亦可单独判断是否老/病/残） 返回值：0(否)  1(是)
--select top 1000 dbo.get_is_lbc(zf_id,null,'5','1',65,65) from zf_jbxx order by csrq 

CREATE function [dbo].[get_is_lbc] 
(
 @zf_id varchar(50),
 @jzrqs datetime,  --截止时间(NULL表示当日)
 @cs  varchar(4),  --返回值参数： 1返回是否老犯  2返回是否病犯  3返回是否残犯  4返回是否病残犯  5返回是否老病残
 @lfglfs char(1),  --老犯管理方式：1按年龄判断  2审批后在ZF_LFGL表登记
 @n1 int,          --男老犯年龄界定（若按年龄判断老犯，此参数必需，不允许NULL）
 @n2 int           --女老犯年龄界定（若按年龄判断老犯，此参数必需，不允许NULL）
)
returns tinyint
as
begin
  declare @jg tinyint,@jzrq datetime
  set @jg=0
  
  if @jzrqs is null
    select @jzrq=output from vw_today  --读取当日日期
  else
    set @jzrq=@jzrqs

  if @cs in ('1','5')  --是否老犯/老病残
    begin
      --判断是否老犯
      if @lfglfs='1'
        --按年龄判断
        select @jg=(case when xb='1' then (case when dbo.get_nl(csrq,@jzrq)>=@n1 then 1 else 0 end)
                    else (case when dbo.get_nl(csrq,@jzrq)>=@n2 then 1 else 0 end) end)
          from zf_jbxx where zf_id=@zf_id
      else
        --在ZF_LFGL表判断
        begin
          if exists (select 1 from zf_lfgl where zf_id=@zf_id and (pzrq<=@jzrq or pzrq is null))
            set @jg=1
        end
    end

  if @cs in ('2','4','5') and @jg=0  --是否病犯/病残犯/老病残
    begin
      --判断是否病犯
      if exists (select 1 from sw_bfgl where zf_id=@zf_id and (pzrq<=@jzrq or pzrq is null) and (cxrq is null or cxrq>@jzrq))
        set @jg=1
    end

  if @cs in ('3','4','5') and @jg=0  --是否残犯/病残犯/老病残
    begin
      --判断是否残犯
      if exists (select 1 from sw_cfgl where zf_id=@zf_id and (pzrq<=@jzrq or pzrq is null) and (cxrq is null or cxrq>@jzrq))
        set @jg=1
    end
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_jjxcs]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回加刑或减刑的次数
--select top 1000 dbo.get_jjxcs(zf_id,'2','20121231') from zf_jbxx where zybz='1'

CREATE  function [dbo].[get_jjxcs]
(
 @zf_id varchar(50),  --罪犯编号
 @bdlb char(1),       --刑罚变动类别： 1：加刑  2：减刑
 @jzrq datetime       --截止日期(传NULL 表示当前日期)
)
returns tinyint
as
begin
  declare @jg tinyint
  set @jg=0
  
  if @bdlb='2'
    --减刑次数
    begin
      if @jzrq is null
        --无截止日期
        select @jg=count(*)
          from zf_xfzb a
          where a.zf_id=@zf_id and a.bdlb in ('7','8','10') and not exists (select 1 from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)
      else
        --有截止日期
        begin
          select @jg=count(*)
            from zf_xfzb a
            where a.zf_id=@zf_id and a.pcrq<=@jzrq and a.bdlb in ('7','8','10')
                  and not exists (select 1 from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)
        end
    end
  else
    --加刑次数
    begin
      if @jzrq is null
        --无截止日期
        begin
          select @jg=count(*) from zf_xfzb where zf_id=@zf_id and bdlb in ('3','4','5','6')
          select @jg=@jg+count(*) from zf_xfzb a
            where zf_id=@zf_id and bdlb='17' and exists (select 1 from zf_zm where zf_xfzb_oid=a.oid and zmmc<>'')  --假释又犯罪收监次数
        end
      else
        --有截止日期
        begin
          select @jg=count(*) from zf_xfzb where zf_id=@zf_id and (pcrq<=@jzrq or pcrq is null) and bdlb in ('3','4','5','6')
          select @jg=@jg+count(*) from zf_xfzb a
            where zf_id=@zf_id and pcrq<=@jzrq and bdlb='17' and exists (select 1 from zf_zm where zf_xfzb_oid=a.oid and zmmc<>'')  --假释又犯罪收监次数
        end
    end
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_jl]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回简历信息串
--SELECT top 100 dbo.get_jl(zf_id,'1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_jl]
(
 @zf_id varchar(50), 
 @cs varchar(4)     --返回值参数：1返回简历信息串  2返回捕前单位  3返回捕前职务
)
returns varchar(3000) 
as
begin
  declare @jg varchar(3000),@cr varchar(2)
  set @jg=''
  set @cr=char(13)+char(10)
  
  if @cs='1'
    --简历串
    select @jg=@jg+(case when @jg='' then '' else @cr end)+  --
               isnull(qrq,'')+(case when zrq<>'' then '至' else '以后' end)+
               isnull(zrq,'')+' '+dbo.get_qhmx(dwqh,dwmx)+
               (case when isnull(zy,'')='' then '' else ' '+zy end)+
               (case when isnull(zw,'')='' then '' else ' '+zw end)+
               (case when isnull(zc,'')='' then '' else ' '+zc end)
      from zf_jl where zf_id=@zf_id order by xh
  else if @cs='2'
    --捕前单位
    begin
      select top 1 @jg=dbo.get_qhmx(dwqh,dwmx) from zf_jl where zf_id=@zf_id and bqbz=1 order by xh desc
      if @jg=''
        select top 1 @jg=dbo.get_qhmx(dwqh,dwmx) from zf_jl where zf_id=@zf_id and qrq not like '%[拘逮收][留捕审]%' order by xh desc
    end
  else if @cs='3'
    --捕前职务
    begin
      select top 1 @jg=(case when isnull(zw,'')='' then '' else zw end) from zf_jl where zf_id=@zf_id and bqbz=1 order by xh desc
      if @jg=''
        select top 1 @jg=(case when isnull(zw,'')='' then '' else zw end) from zf_jl where zf_id=@zf_id and qrq not like '%[拘逮收][留捕审]%' order by xh desc
    end
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_jsh_cwh]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




--返回截止日期时的监舍、床位

--监舍管理表名及结构不明，此函数未完成

CREATE  function [dbo].[get_jsh_cwh]
(
 @zf_id varchar(50),
 @jzrq datetime,     --截止日期(NULL表示当前日期)
 @cs varchar(6)      --返回值参数 1:监舍号  2:床位号  3:监舍号+'@'+床位号
)
returns varchar(50)
as
begin
  declare @jg varchar(50)

  if @jzrq is null
    --返回最新数据
set @jg=''
  else
    --返回截止日期时的数据
set @jg=''

  if @jg is null
    set @jg=''

  return @jg
end






GO
/****** Object:  UserDefinedFunction [dbo].[get_jwzx_ysjrq]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回监外执行的应收监日期
--select dbo.get_jwzx_ysjrq(zf_id,oid,null) from zf_jwzx

CREATE function [dbo].[get_jwzx_ysjrq]
(
 @zf_id varchar(50),
 @oid varchar(50),    --监外执行主表OID (若传NULL 返回截止日期时尚未收监人员的应收监日期)
 @jzrqs datetime   --截止日期（若传NULL 表示当前日期）
)
returns varchar(8)
as
begin
  declare @jg varchar(8),@jzrq datetime,@jwzx_oid varchar(50),@bwnx varchar(6),@pzrq datetime
  set @jzrq=(case when @jzrqs is null then '99991231' else @jzrqs end)
  if @oid is null or @oid=''
    --读取尚未收监的监外执行主表OID
    select top 1 @jwzx_oid=oid from zf_jwzx where zf_id=@zf_id and zxrq<=@jzrq and zzrq is null order by zxrq
  else
    set @jwzx_oid=@oid
  
  if @jwzx_oid<>''
    begin
      --读取续保表的应收监日期
      select top 1 @jg=convert(varchar(8),sjrq,112),@bwnx=xbnx from zf_jwzx_xb where zf_jwzx_oid=@jwzx_oid and pzrq<=@jzrq order by pzrq desc
      if @bwnx is null
        --无续保记录，读取主表的应收监日期        
        select @jg=convert(varchar(8),sjrq,112),@bwnx=bwnx from zf_jwzx where oid=@jwzx_oid
      if @bwnx like '99%'
        --至刑满
        set @jg='至刑满'
    end
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_jwzxxx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回监外执行信息
--select dbo.get_jwzxxx(zf_id,oid,null,'32') from zf_jwzx

CREATE  function [dbo].[get_jwzxxx]
(
 @zf_id varchar(50),  
 @oid varchar(50),    --监外执行主表OID (可传NULL，若传NULL，由本函数读取该罪犯最后一次监外执行OID)
 @jzrqs datetime,  --截止日期（若传NULL 表示当前日期）
 @cs varchar(4)    --返回值参数 1：返回首次呈报执行类别编码  2：返回续保的执行类别(若无续保，同1)  3：返回首次呈报单位编码  4：返回续保所在单位编码(若无续保，同3)  5：返回总年限 (5：0604  51：06_04  52：6年4个月） 若为“至刑满”，返回“至刑满”
)
returns varchar(20)
as
begin
  declare @jg varchar(20),@jzrq datetime,@jwzx_oid varchar(50)
  set @jg=''
  set @jzrq=(case when @jzrqs is null then '99991231' else @jzrqs end)
  if @oid is null
    select top 1 @jwzx_oid=oid from zf_jwzx where zf_id=@zf_id and zxrq<=@jzrq order by pzrq desc
  else
    set @jwzx_oid=@oid
  
  if @jwzx_oid<>''
    begin
      if @cs='1'
        --读取首次呈报的执行类别
        select @jg=zxlb from zf_jwzx where oid=@jwzx_oid
      else if @cs='2'
        --读取截止日期时的执行类别
        select top 1 @jg=zxlb
          from (select zxlb,pzrq from zf_jwzx where oid=@jwzx_oid and zxrq<=@jzrq
                union all
                select zxlb,pzrq from zf_jwzx_xb where zf_jwzx_oid=@jwzx_oid and zxrq<=@jzrq) t
          order by pzrq desc
      else if @cs='3'
        --读取首次呈报所在单位
        select @jg=gydw from zf_jwzx where oid=@jwzx_oid
      else if @cs='4'
        --读取截止日期时监外执行所在单位
        select top 1 @jg=gydw
          from (select gydw,pzrq from zf_jwzx where oid=@jwzx_oid and zxrq<=@jzrq
                union all
                select gydw,pzrq from zf_jwzx_xb where zf_jwzx_oid=@jwzx_oid and zxrq<=@jzrq) t
          order by pzrq desc
      else if @cs like '5%'
        --读取监外执行总年限(首次批准年限+续保年限)
        begin
          declare @year integer,@month integer,@bwnx varchar(6)
          set @year=0
          set @month=0
          
          --读取最后一次批准的年限,判断是否是“至刑满”
          select top 1 @bwnx=bwnx
            from (select bwnx,pzrq from zf_jwzx where oid=@jwzx_oid
                  union all
                  select xbnx,pzrq from zf_jwzx_xb where zf_jwzx_oid=@jwzx_oid and (zxrq<=@jzrq or zxrq is null)) as jwzx
            order by pzrq desc
          if @bwnx='' or @bwnx is null or @bwnx like '99%'
            set @jg='至刑满'
          else
            begin
              select @year=sum(cast(left(bwnx,2) as integer)),@month=sum(cast(substring(bwnx,3,2) as integer))
                from (select bwnx from zf_jwzx where oid=@jwzx_oid and isnumeric(bwnx)=1 and bwnx not like '99%'
                      union all
                      select xbnx from zf_jwzx_xb where zf_jwzx_oid=@jwzx_oid and (zxrq<=@jzrq or zxrq is null) and isnumeric(xbnx)=1 and xbnx not like '99%') as jwzx
              
              set @year=@year+round(@month/12,0)
              set @month=@month-round(@month/12,0)*12
              if @year>0 or @month>0
                begin
                  set @jg=right(cast(100+@year as varchar(3)),2)+right(cast(100+@month as varchar(3)),2)
                  if @cs='52'
                    set @jg=dbo.get_mask_xq(@jg+'00',2,'')
                  else if @cs='51'
                    set @jg=left(@jg,2)+'_'+right(@jg,2)
                end
            end
        end
    end
    
  if @jg is null
    set @jg=''
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_jxcd]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--按截止日期返回“减刑尺度”编码
--select dbo.get_jxcd(zf_id,null) from zf_jbxx where zybz='1'

CREATE function [dbo].[get_jxcd]
(
 @zf_id varchar(50),
 @jzrq datetime    --截止日期(传NULL 表示当前日期)
)
returns varchar(4)
as
begin
  declare @jg varchar(4)
  
  if @jzrq is null
    select @jg=jxcd from zf_jxcd where zf_id=@zf_id and flag='1'
  else
    select top 1 @jg=jxcd from zf_jxcd where zf_id=@zf_id and (pzrq<=@jzrq or pzrq is null) order by pzrq desc
  
  if @jg is null
    set @jg=''

  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_jxfd_lc]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回历次减刑幅度
--select top 1000 dbo.get_jxfd_lc(zf_id,null,null,'2','4501') from zf_jbxx where zybz='1'

CREATE  function [dbo].[get_jxfd_lc]
( 
 @zf_id varchar(50),  --罪犯ID
 @date1 datetime,     --日期范围起（NULL表示无起日限制  上次减刑幅度不使用此参数）
 @date2 datetime,     --日期范围止（NULL表示当前日期）
 @cs varchar(4),      --返回值参数  1:格式2010.10.10减为无期  2011.12.12减1年  2：格式2010年10月10日减为无期  2011年12月12日减1年  H：每记录带换行符号(附加在格式参数后,如1H  2H)
 @dwbm varchar(6)     --单位编码(用于用户特殊需求)
)
returns varchar(500)
as
begin
  declare @jg varchar(500),@rq1 datetime,@rq2 datetime,@cr char(1)
  set @jg=''
  
  set @rq1=(case when @date1 is null then '19500101' else @date1 end)
  set @rq2=(case when @date2 is null then '99991231' else @date2 end)
  
  --历次减刑幅度
  select @jg=@jg+
             (case when a.pcrq is null then '' else dbo.get_mask_date(pcrq,(case when @cs like '2%' then 2 else 1 end),4) end)+
             (case when a.bdfd<'99' and a.bdfd<>'' then '减'+dbo.get_mask_xq(bdfd,'2','')
                   when a.bdfd='9990' then '减为有期'+dbo.get_mask_xq(xq,'2','')
                   when a.xq='9995' then '减为无期'
                   when a.xq='9996' then '减为死缓'
                   else '减刑幅度空' end)+(case when @cs like '%H%' then char(10) else '  ' end)
    from zf_xfzb a
    where a.zf_id=@zf_id and a.bdlb in ('7','8','10') and pcrq between @rq1 and @rq2 and not exists (select 1 from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)
    order by a.pcrq
  
  if @jg<>''
    begin
      if @cs like '%H%'
        set @jg=left(@jg,len(@jg)-1)
      else
        set @jg=rtrim(@jg)
    end
    
  return @jg
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_jxfd_lj]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回累计减刑幅度
--select top 1000 dbo.get_jxfd_lj(zf_id,null,'1N','') from zf_jbxx where zybz='1'

/* 返回值形式参数(@cs)
0  010406                   (仅考虑可计算的幅度，不考虑死缓无期减刑，可用于条件检索条件)
1  04_06_00(死缓-无期-有期) （输出格式，附加死缓无期减刑说明）
1N 04_06_00                 （输出格式，不附加死缓无期减刑说明）
2  4年6个月(死缓-无期-有期)  （输出格式，附加死缓无期减刑说明）
2N 4年6个月                 （输出格式，不附加死缓无期减刑说明）
*/

CREATE  function [dbo].[get_jxfd_lj]
(
 @zf_id varchar(50),  --罪犯编号/罪犯ID
 @jzrqs datetime,     --截止日期(传NULL 表示当前日期)
 @cs varchar(6),      --返回值形式参数
 @dwbm varchar(4)     --用户单位编码（用于用户特殊需求）
)
returns varchar(100)	
as
begin
  declare @jg varchar(100),@jzrq datetime
  set @jg=''
  set @jzrq=(case when @jzrqs is null then '99991231' else @jzrqs end)
  
  if exists (select 1 from zf_xfzb a where zf_id=@zf_id and a.pcrq<=@jzrq and a.bdlb in ('7','8','10') and not exists (select 1 from zf_xfzb_cxjx where zf_xfzb_oid=a.oid))
    --有减刑记录
    begin
      declare @year int,@month int,@day int,@tmp int
      
      --减刑幅度求和（滤除无期、死缓减刑）
      select @year=sum(cast(left(a.bdfd,2) as int)),
             @month=sum(cast(substring(a.bdfd,3,2) as int)),
             @day=sum(cast(substring(a.bdfd,5,2) as int))
        from zf_xfzb a
        where a.zf_id=@zf_id and a.pcrq<=@jzrq and a.bdlb in ('7','8','10') and isnumeric(a.bdfd)=1 and a.bdfd not like '99%'
              and not exists (select 1 from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)
      
      if @year+@month+@day>0
        begin
          set @tmp=@day/30
          set @day=@day%30
          set @month=@month+@tmp
          set @tmp=(@month-@month%12)/12
          set @month=@month%12
          set @year=@year+@tmp
          set @jg=substring(cast(100+@year as varchar(3)),2,2)+
                  substring(cast(100+@month as varchar(3)),2,2)+
                  substring(cast(100+@day as varchar(3)),2,2)
          
          if @cs like '1%'
            set @jg=dbo.get_mask_xq(@jg,1,'')  --04_06_00格式
          else if @cs like '2%'
            set @jg=dbo.get_mask_xq(@jg,2,'')  --4年6个月格式
        end
      
      if @cs='1' or @cs='2'
        begin
          --有无期或死缓减刑记录的,附加无期死缓减刑提示
          declare @jgs varchar(80)
          set @jgs=''
          select @jgs=@jgs+(case when @jgs='' then '' else '-' end)+
                      (case when a.bdfd='9990' then '有期'
                       else dbo.get_mask_xq(a.xq,1,'') end)
            from zf_xfzb a
            where a.zf_id=@zf_id and (a.pcrq<=@jzrq or a.pcrq is null) and a.bdlb in('1','7','8','10') and (a.xq like '99%' or a.bdfd like '99%')
                  and not exists (select 1 from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)
            order by pcrq
          
          if @jg<>'' and @jgs<>''
            set @jg=@jg+'('+@jgs+')'
          else if @jg='' and @jgs<>''
            set @jg=@jgs
        end
    end
    
	return @jg
end 




GO
/****** Object:  UserDefinedFunction [dbo].[get_jxfd_sc]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回上次减刑幅度
--select top 1000 dbo.get_jxfd_sc(zf_id,null,'2','') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_jxfd_sc]
( 
 @zf_id varchar(50), --罪犯ID
 @jzrq datetime,     --截止日期（NULL表示当前日期）
 @cs varchar(6),     --返回值参数  0：格式030600/9995/9990 （用于条件检索作为条件） 1:格式 03_06_00/减为无期（用于条件检索输出） 2:格式3年6个月/减为无期（用于条件检索输出）
 @dwbm varchar(6)    --用户单位编码(用于用户特殊需求)
)
returns varchar(100)
as
begin
  declare @jg varchar(100),@xq varchar(6)
  
  --读取上次减刑幅度
  if @jzrq is null
    select top 1 @jg=isnull(bdfd,''),@xq=xq
      from zf_xfzb a
      where a.zf_id=@zf_id and a.bdlb in ('7','8','10') and not exists (select 1 from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)  --滤除撤销的减刑记录
      order by a.pcrq desc
  else
    select top 1 @jg=isnull(bdfd,''),@xq=xq
      from zf_xfzb a
      where a.zf_id=@zf_id and a.bdlb in ('7','8','10') and a.pcrq<=@jzrq and not exists (select 1 from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)  --滤除撤销的减刑记录
      order by a.pcrq desc
  
  if @jg is null
    --无减刑记录
    set @jg=(case when @cs='0' then null else '' end)
  else if @jg=''
    --有减刑记录，减刑幅度空(用户未输入)
    begin
      if @xq like '99%'
        --上次减刑后的刑期为无期
        set @jg=@xq
      else
        set @jg=' 幅度空'  --左边保留一个空格，用于条件判断（空格小于数字）
    end
  
  if @cs='1'
    --输出格式：03_06_00 减为无期  减为有期
    set @jg=(case when @jg<'99' and @jg not like '%空' and @jg<>'' then left(@jg,2)+'_'+substring(@jg,3,2)+'_'+substring(@jg,5,2)
                  when @jg='9990' then '减为有期'
                  when @jg='9995' then '减为无期'
                  when @jg='9996' then '减为死缓'
                  else @jg end)
  else if @cs='2'
    --输出格式：3年6个月 减为无期  减为有期
    set @jg=(case when @jg<'99' and @jg not like '%空' and @jg<>'' then dbo.get_mask_xq(@jg,2,'')
                  when @jg='9990' then '减为有期'
                  when @jg='9995' then '减为无期'
                  when @jg='9996' then '减为死缓'
                  else @jg end)
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_lbc]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回老病残情况
--select top 200 dbo.get_lbc(zf_id,null,'0','2',65,65) from zf_jbxx as a where zybz='1' and (exists (select 1 from zf_lfgl where zf_id=a.zf_id) or exists (select 1 from sw_bfgl where zf_id=a.zf_id) or exists (select 1 from sw_cfgl where zf_id=a.zf_id))

CREATE   function [dbo].[get_lbc] 
(
 @zf_id varchar(50), 
 @jzrq datetime,   --截止日期（NULL表示当前日期）
 @cs   varchar(2), --返回值参数 0:老病残情况  1:老  2：疾病类别及名称  3：残疾类别及名称
 @lfglfs char(1),  --老犯管理方式 1按年龄判断老犯  2审批后在老犯管理表ZF_LFGL中登记
 @n1 int,          --男老犯年龄界定（若按年龄判断老犯，此参数必需）
 @n2 int           --女老犯年龄界定（若按年龄判断老犯，此参数必需）
)
returns varchar(100) 
as
begin
  declare @jg varchar(100)
  set @jg=''
  
  if @cs in ('0','1')
    begin
      declare @jzsj datetime
      if @jzrq is null
        select @jzsj=output from vw_today  --读取当日日期作为截止日期
      else
        set @jzsj=@jzrq
      
      if @lfglfs='1'
        --按年龄判断老犯
        select @jg=(case when dbo.get_nl(csrq,@jzsj)>=(case when xb='1' then @n1 else @n2 end) then '老' else '' end)
          from zf_jbxx where zf_id=@zf_id
      else
        --从ZF_LFGL表判断老犯
        begin
          if exists (select 1 from zf_lfgl where zf_id=@zf_id and pzrq<=@jzsj)
            set @jg='老'
        end
    end
  
  if @cs in ('0','2')
    --病
    begin
      if @jzrq is null
        select  @jg=@jg+(case when @jg='' then '' else '、' end)+isnull(c.mc,'')+
                        (case when c.mc like '%'+b.jbmc+'%' or b.jbmc like '%'+c.mc+'%' or b.jbmc='' or c.mc is null then '' else '('+b.jbmc+')' end)
         from sw_bfgl a join sw_bfgl_jd b on a.oid=b.sw_bfgl_oid left join pub_dmb c on b.jblb=c.bm and c.lb='43'
         where a.zf_id=@zf_id and a.cxrq is null and (isnull(b.jblb,'')<>'' or isnull(b.jbmc,'')<>'') order by b.jdrq
      else
        select  @jg=@jg+(case when @jg='' then '' else '、' end)+c.mc+
                        (case when c.mc like '%'+b.jbmc+'%' or b.jbmc like '%'+c.mc+'%' or b.jbmc='' or c.mc is null then '' else '('+b.jbmc+')' end)
          from sw_bfgl a join sw_bfgl_jd b on  a.oid=b.sw_bfgl_oid  left join pub_dmb c on b.jblb=c.bm and c.lb='43'
          where a.zf_id=@zf_id and (b.jdrq<=@jzrq or b.jdrq is null) and (a.cxrq>@jzrq or a.cxrq is null) and (isnull(b.jblb,'')<>'' or isnull(b.jbmc,'')<>'') order by b.jdrq  
    end
  
  if @cs in ('0','3')
    --残
    begin
      if @jzrq is null
        --返回残疾类别名称
        select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('41',b.cjlb)+
                       (case when isnull(b.cjmc,'')='' then '' else '('+b.cjmc+')' end)
          from sw_cfgl a join sw_cfgl_jd b on  a.oid=b.sw_cfgl_oid
          where  a.zf_id=@zf_id and a.cxrq is null and (isnull(b.cjlb,'')<>'' or isnull(b.cjmc,'')<>'') order by b.jdrq
      else
        select  @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('41',b.cjlb)+
                        (case when isnull(b.cjmc,'')='' then '' else '('+b.cjmc+')' end)
          from sw_cfgl a join sw_cfgl_jd b on  a.oid=b.sw_cfgl_oid
          where a.zf_id=@zf_id and (b.jdrq<=@jzrq or b.jdrq is null) and (a.cxrq>@jzrq or a.cxrq is null) and (isnull(b.cjlb,'')<>'' or isnull(b.cjmc,'')<>'') order by b.jdrq
    end
    
  return @jg
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_mask_bznx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--将剥政年限串转换为输出形式

CREATE  function [dbo].[get_mask_bznx]
(
 @bznx varchar(6),  --剥政年限串，格式：100603
 @cs1 varchar(2),   --返回值形式  1：10_06_03/终身   2：10年6个月3天/终身
 @cs2 varchar(40)   --返回值前面附加的字符串，如：剥政、剥夺政治权利
)
returns varchar(50)

as
begin
  if isnumeric(@bznx)=0 or @bznx is null
    return ''
  if cast(@bznx as int)=0
    return ''

  declare @jg varchar(50)
  set @jg=''
  
  if @bznx='99' 
    set @jg='终身'
  else	
    begin
      if @cs1='1'
        --返回值形式：10_06_03
        set @jg=left(@bznx,2)+'_'+substring(@bznx,3,2)+'_'+substring(@bznx,5,2)
      else
        --返回值形式：10年6个月3天
        set @jg=(case when @bznx like '00%' then '' else cast(cast(left(@bznx,2) as int) as varchar(2))+'年' end)+
                (case when @bznx like '__00%' then '' else cast(cast(substring(@bznx,3,2) as int) as varchar(2))+'个月' end)+
                (case when @bznx like '____00' then '' else cast(cast(substring(@bznx,5,2) as int) as varchar(2))+'天' end)
    end
  if @cs2<>'' and @jg<>''
    set @jg=@cs2+@jg
  
	return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_mask_date]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--转换日期输出格式

CREATE function [dbo].[get_mask_date]
(
	@date datetime,
  @cs1 int,        --返回值形式：0:20050101  1: 2005.01.01   2: 2005年1月1日   3: 二〇〇五年一月二十三日 
  @cs2 int         --返回年份的位数: 2: 2位年份   4: 4位年份
)
returns varchar(40)

as
begin
  if @date is null
    return ''
  
	declare @jg varchar(40),@s varchar(8)
  set @jg=''
  
  set @s=convert(varchar(8),@date,112)
  if @cs1='0'
    --20050101的形式
    set @jg=(case when @cs2=2 then right(@s,6) else @s end)
  else if @cs1=1
    --2005.01.01的形式
    set @jg=(case when @cs2=4 then left(@s,4) else substring(@s,3,2) end)+'.'+substring(@s,5,2)+'.'+substring(@s,7,2)
  else if @cs1=2
    --2005年1月1日的形式
    set @jg=(case when @cs2=4 then left(@s,4) else substring(@s,3,2) end)+'年'+cast(cast(substring(@s,5,2) as int) as varchar(2))+'月'+cast(cast(substring(@s,7,2) as int) as varchar(2))+'日'
  else if @cs1=3
    begin
      --二〇〇五年一月二十三日的形式
      declare @ss char(20)
      set @ss='〇一二三四五六七八九'
      
      -- 转换年
      set @jg=substring(@ss,cast(substring(@s,1,1) as int)+1,1)+
              substring(@ss,cast(substring(@s,2,1) as int)+1,1)+
              substring(@ss,cast(substring(@s,3,1) as int)+1,1)+
              substring(@ss,cast(substring(@s,4,1) as int)+1,1)+ '年'
      -- 转换月
      if substring(@s,5,1) > '0'
        set @jg = @jg + '十'
      if substring(@s,6,1) > '0'
        set @jg = @jg + substring(@ss,cast(substring(@s,6,1) as int)+1,1)			
      set @jg = @jg + '月'

      -- 转换日
      if substring(@s,7,1) > '1'
        set @jg = @jg + substring(@ss,cast(substring(@s,7,1) as int)+1,1)
      if substring(@s,7,1) > '0'
        set @jg = @jg + '十'
      if substring(@s,8,1) > '0'
        set @jg = @jg + substring(@ss,cast(substring(@s,8,1) as int)+1,1)			
      set @jg = @jg + '日'
    end

	return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_mask_date_c]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--处理8、6、4位字符型日期字段值

--select dbo.get_mask_date_c('200812',1,4)
--select dbo.get_mask_date_c('200812',2,4)

CREATE function [dbo].[get_mask_date_c]
(
 @date varchar(8),
 @cs1 int,        --返回值形式：1:用为“.”作为分隔符号  2:2001年、2001年3月的形式
 @cs2 int         --返回年份的位数: 2: 2位年份   4: 4位年份
)
returns varchar(40)
as
begin
  if @date is null or isnumeric(@date)=0
    return ''
  
  set @date=replace(@date,'.','')

  declare @len int
  set @len=len(@date)
  if @len<4
    return ''
  
	declare @jg varchar(20),@month varchar(2),@day varchar(2)
  set @jg=''
  
  if @len=4
    set @jg=(case when @cs2=2 then right(@date,2) else @date end)+(case when @cs1=2 then '年' else '' end)
  else if @len=5
    set @jg=(case when @cs2=2 then substring(@date,3,2) else left(@date,4) end)+ --年份处理
            (case when @cs1=1 then '.0' else '年' end)+right(@date,1)+(case when @cs1=2 then '月' else '' end) --月份处理 
  else if @len=6
    begin
      set @month=right(@date,2)
      set @jg=(case when @cs2=2 then substring(@date,3,2) else left(@date,4) end)+ --年份处理
              (case when @cs1=1 then '.' else '年' end)+(case when @cs1=1 then @month else cast(cast(@month as int) as varchar(2))+'月' end) --月份处理 
    end
  else if @len=7
    begin
      set @month=substring(@date,5,2)
      set @day=right(@date,1)
      set @jg=(case when @cs2=2 then substring(@date,3,2) else left(@date,4) end)+ --年份处理
              (case when @cs1=1 then '.' else '年' end)+(case when @cs1=1 then @month else cast(cast(@month as int) as varchar(2))+'月' end)+ --月份处理 
              (case when @cs1=1 then '.0'+@day else @day+'日' end)
    end
  else if @len=8
    begin
      set @month=substring(@date,5,2)
      set @day=right(@date,2)
      set @jg=(case when @cs2=2 then substring(@date,3,2) else left(@date,4) end)+ --年份处理
              (case when @cs1=1 then '.' else '年' end)+(case when @cs1=1 then @month else cast(cast(@month as int) as varchar(2))+'月' end)+ --月份处理 
              (case when @cs1=1 then '.'+@day else cast(cast(@day as int) as varchar(2))+'日' end)
    end

	return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_mask_fjx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--函数功能：返回附加刑串
--select dbo.get_mask_fjx('100000','没收全部财产',50000.00,1)

CREATE  function [dbo].[get_mask_fjx]
(
@bznx varchar(6),     --剥夺政治年限
@mscc varchar(1000),  --没收财产
@fjje decimal(14,2),  --罚金金额
@czcj tinyint,        --驱逐出境
@cs varchar(2)        --文字“剥夺政治权利”返回形式  1：返回“剥政”   2：返回“剥夺政治权利”
)
returns varchar(1200)
as
begin
	declare @jg varchar(1200) 
  set @jg=''
  
  --处理剥政
	if isnumeric(@bznx)=0 or @bznx is null
    set @jg=''
  else if cast(@bznx as int)=0
    set @jg=''
	else if @bznx='99' 
    set @jg=(case when @cs='2' then '剥夺政治权利终身' else '剥政终身' end)
	else	
    set @jg=(case when @cs='2' then '剥夺政治权利' else '剥政' end)+
            (case when @bznx like '00%' then '' else cast(cast(left(@bznx,2) as int) as varchar(2))+'年' end)+
            (case when @bznx like '__00%' then '' else cast(cast(substring(@bznx,3,2) as int) as varchar(2))+'个月' end)+
            (case when @bznx like '____00' then '' else cast(cast(substring(@bznx,5,2) as int) as varchar(2))+'天' end)
  
  --处理没收财产
  if @mscc<>'' and @mscc is not null
    begin
      set @mscc=ltrim(@mscc)
      if @mscc like '没收%'
        set @jg=@jg+(case when @jg='' then '' else '，' end)+@mscc
      else
        set @jg=@jg+(case when @jg='' then '' else '，' end)+'没收'+@mscc
    end
  
  --处理罚金
  if @fjje>0
    begin
      declare @je varchar(18)
      set @je=convert(varchar(18),@fjje)
      if right(@je,3)<>'.00'
        set @jg=@jg+(case when @jg='' then '' else '，' end)+'罚金'+convert(varchar(18),@fjje)+'元'
      else
        begin
          set @je=substring(@je,0,len(@je)-2)	
          set @jg=@jg+(case when @jg='' then '' else '，' end)+'罚金'+(case when @je like '%0000' then convert(varchar(12),cast(substring(@je,0,len(@je)-3) as int))+'万元' else @je+'元' end )
        end
		end
  
  --处理驱逐出境
  if @czcj=1
    set @jg=@jg+(case when @jg='' then '' else '，' end)+'驱逐出境'
  
	return @jg
end






GO
/****** Object:  UserDefinedFunction [dbo].[get_mask_xq]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--将刑期、加减刑幅度、顺延天数 转换为输出格式

CREATE  function [dbo].[get_mask_xq]
(
 @xq varchar(6),  --刑期或幅度串，格式：100603
 @cs1 int,        --返回值形式：1：10_06_03/无期/死缓   2：10年6个月3天/无期/死缓
 @cs2 varchar(40) --返回值前面附加的字符串，如：判处  减刑幅度  刑期  止日顺延(止日顺延时返回顺延天数串)
)
returns varchar(80)

as
begin
  if isnumeric(@xq)=0 or @xq is null
    return ''
  if cast(@xq as int)=0
    return ''

	declare @jg varchar(80)

  if @cs2 like '%顺延%'
    begin
      set @jg=@xq    --返回顺延的天数
      set @cs2=''
    end
  else if @xq like '99%'
    set @jg=(case @xq when '9995' then '无期'
                      when '9996' then '死缓'
                      when '9990' then '有期'
                      when '9997' then '死刑'
                      else '' end)
  else	
    begin
      if @cs1=1
        --返回值形式：10_06_03
        set @jg=left(@xq,2)+'_'+substring(@xq,3,2)+'_'+substring(@xq,5,2)
      else
        --返回值形式：10年6个月3天
        set @jg=(case when @xq like '00%' then '' else cast(cast(left(@xq,2) as int) as varchar(2))+'年' end)+
                (case when @xq like '__00%' then '' else cast(cast(substring(@xq,3,2) as int) as varchar(2))+'个月' end)+
                (case when @xq like '____00' or len(@xq)<5 then '' else cast(cast(substring(@xq,5,2) as int) as varchar(2))+'天' end)
    end
  if @cs2<>''
    begin
      if @cs2 like '判处%'
        begin
          if @xq like '99%'
            set @jg='判处'+(case @xq when '9995' then '无期徒刑' when '9996' then '死刑，缓期二年执行' else @jg end)
          else
            set @jg='判处有期徒刑'+@jg
        end
      else if @cs2 like '减刑幅度%'
        --处理减刑幅度
        begin
          if @xq like '99%'
            set @jg='减为'+(case @xq when '9995' then '无期徒刑' when '9990' then '有期徒刑' else @jg end)
          else
            set @jg='减刑'+@jg
        end
      else if @cs2 like '减刑%'
        --处理减刑幅度
        begin
          if @xq like '99%'
            set @jg='减为'+(case @xq when '9995' then '无期徒刑' when '9990' then '有期徒刑' else @jg end)
        end
      else if @cs2 like '加刑幅度%'
        --处理加刑幅度
        begin
          if @xq like '99%'
            set @jg='加至'+(case @xq when '9995' then '无期徒刑' when '9996' then '死刑，缓期二年执行' else @jg end)
          else
            set @jg='加刑'+@jg
        end
      else
        set @jg=@cs2+@jg
    end

	return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_mc]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回编码名称

CREATE  function [dbo].[get_mc] 
(
 @lb varchar(4),
 @bm varchar(10)
)
returns varchar(200)

as
begin
	declare @jg varchar(200)
	set @jg=''
  select  @jg=mc from pub_dmb where lb=@lb and bm=@bm
  
	return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_mc2]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--根据2个或3个编码类别和编码，返回汉字名称 

CREATE function [dbo].[get_mc2]
(
 @lb varchar(6),  --类别
 @bm varchar(10)  --编码
)
returns varchar(200)
as
begin
  declare @jg varchar(200)
  set @jg=''

  if len(@lb)=4
    select top 1 @jg=mc from pub_dmb where (lb=left(@lb,2) or lb=right(@lb,2)) and bm=@bm
  else if len(@lb)=6
    select top 1 @jg=mc from pub_dmb where (lb=left(@lb,2) or lb=substring(@lb,3,2) or lb=right(@lb,2)) and bm=@bm
  else
    select @jg=mc from pub_dmb where lb=@lb and bm=@bm
    
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_nl]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--计算年龄 (无法计算的返回NULL)

CREATE  function [dbo].[get_nl] 
(
 @csrq datetime,  --出生日期
 @jzrq datetime   --截止日期(传NULL 表示当前日期)
)
returns smallint
as
begin
  declare @jg smallint
  if @csrq is null or @jzrq<=@csrq
    set @jg=null
  else
    begin
      if @jzrq is null
        select @jzrq=output from vw_today  --读取当日日期
      
      set @jg=year(@jzrq)-year(@csrq)
      if right(convert(varchar(8),@jzrq,112),4)<right(convert(varchar(8),@csrq,112),4)
        set @jg=@jg-1
    end
    
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_nwfg]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--按截止日期返回“内务分工串”
--select top 1000 dbo.get_nwfg(zf_id,null,'') from zf_jbxx where zybz='1'

CREATE     function [dbo].[get_nwfg]
(
 @zf_id varchar(50),
 @jzrq datetime,    --截止日期(传NULL 表示当前日期)
 @dwbm varchar(4)   --用户单位编码（用于用户特殊需求）
)
returns varchar(40)
as
begin
  declare @jg varchar(40)
  set @jg=''
  
  if @jzrq is null
    --读取所有未撤销的内务分工
    select @jg=@jg+(case when @jg='' then '' else '、' end)+nwfg from zf_nwfg where zf_id=@zf_id and cxrq is null and not (nwfg='' or nwfg is null) order by pzrq
  else
    --读取截止日期前的所有未撤销的内务分工
    select @jg=@jg+(case when @jg='' then '' else '、' end)+nwfg from zf_nwfg where zf_id=@zf_id and (pzrq<=@jzrq or pzrq is null) and (cxrq is null or cxrq>@jzrq) and not (nwfg='' or nwfg is null) order by pzrq

  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_period]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS OFF
GO
SET QUOTED_IDENTIFIER ON
GO



--获取各时间段的起止日期,用于对比分析 （返回值类型：表）
--示例: select * from  dbo.get_period('h','20100501','20120630')

CREATE FUNCTION [dbo].[get_period]
(
 @depart char(1) ,  --间隔  y:年 h:半年(half) q:季度(quarter) m：月
 @Date1 DateTime,   --开始时间
 @Date2 DateTime    --结束时间 
)
returns @res table (period varchar(12), StartDate varchar(8), EndDate varchar(8))
as
begin
  declare @cDate Datetime, @y int,@h int, @m int,@q int,@d int, @Period varchar(12), @StartDate varchar(8),@EndDate varchar(8) 
  if @depart not in('y','h','q','m')
  return
  set @cDate=convert(varchar(6),@Date1,112)+'01'
  while @cDate<=@Date2
  begin    
    set @y=year(@cDate)
    set @m=month(@cDate)
    set @h=(@m-1)/6+1 
    set @q=(@m-1)/3+1 
    set @Period=Convert(varchar(4),@y)+'年'
    if(@depart='y')--年
    begin
       set @StartDate=Convert(varchar(4),@y)+'0101'
       set @EndDate=Convert(varchar(4),@y)+'1231'
       set @cDate=dateadd(yy,1,@cDate)
    end else
    if(@depart='h')--半年
    begin
 	set @Period=@Period+ case @h when 1 then '上半年' else '下半年' end
        set @StartDate=Convert(varchar(4),@y)+ Convert(varchar(2),(@h-1)*6+1)+ '01'
        if len(@StartDate)<8
        set @StartDate=substring(@StartDate,1,4)+'0'+right(@StartDate,3)
        set @EndDate=convert(varchar(8),dateadd(m,6,@StartDate),112)
        set @EndDate=convert(varchar(8),dateadd(d,-1,@EndDate),112)
        set @cDate=dateadd(q,2,@cDate)
    end else
    if(@depart='q')--季
    begin
	set @Period=@Period+ convert(char(1), @q)+'季'
        set @StartDate=Convert(varchar(4),@y)+ Convert(varchar(2),(@q-1)*3+1)+ '01'
        if len(@StartDate)<8
        set @StartDate=substring(@StartDate,1,4)+'0'+right(@StartDate,3)
        set @EndDate=convert(varchar(8),dateadd(m,3,@StartDate),112)
        set @EndDate=convert(varchar(8),dateadd(d,-1,@EndDate),112)
        set @cDate=dateadd(q,1,@cDate)
    end else
    begin  --月
        set @Period=@Period + replicate('0',1- @m/10) + convert(varchar(2),@m)+'月'
        set @StartDate=Convert(varchar(4),@y)+ Convert(varchar(2),@m)+ '01'
        if len(@StartDate)<8
        set @StartDate=substring(@StartDate,1,4)+'0'+right(@StartDate,3)
        set @EndDate=convert(varchar(8),dateadd(m,1,@StartDate),112)
        set @EndDate=convert(varchar(8),dateadd(d,-1,@EndDate),112)
        set @cDate=dateadd(m,1,@cDate)
    end
 
    if @StartDate<convert(varchar(8),@Date1,112)
    set @StartDate=convert(varchar(8),@Date1,112)
 
    if @EndDate>convert(varchar(8),@Date2,112)
    set @EndDate=convert(varchar(8),@Date2,112)
    insert into  @res values(@Period,@StartDate,@EndDate) 

  end

  return
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_pjjg]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--函数功能：返回原判机关（终审判决法院）
--select top 1000 dbo.get_pjjg(zf_id) from zf_jbxx where zybz='1'

CREATE function [dbo].[get_pjjg]
(
 @zf_id varchar(50)  --罪犯ID
)
returns varchar(20)
as
begin
  declare @jg varchar(200)
  set @jg=''
  
  select @jg=isnull(pcqh,'')+isnull(pcmx,'') from zf_xfzb where zf_id=@zf_id and iszs='1'

  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_pjrq]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回原判判决日期（终审判决日期）
--select top 1000 dbo.get_pjrq(zf_id,'1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_pjrq]
(
 @zf_id varchar(50),
 @cs varchar(2)     --返回值格式  0：返回日期字符串20050908   1：返回2005.09.08   2：返回2005年9月8日
)
returns varchar(20)
as
begin
  declare @jg varchar(20)
  
  select top 1 @jg=convert(varchar(8),pcrq,112) from zf_xfzb where zf_id=@zf_id and iszs='1'
  if @jg is null
    return ''
  else if @cs ='1'
    set @jg=stuff(stuff(@jg,5,0,'.'),8,0,'.')
  else if @cs='2'
    set @jg=left(@jg,4)+'年'+cast(cast(substring(@jg,5,2) as int) as varchar(2))+'月'+cast(cast(substring(@jg,7,2) as int) as varchar(2))+'日'
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_py]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS OFF
GO
SET QUOTED_IDENTIFIER ON
GO


--select * from dbo.get_py('李行',1)

CREATE  function [dbo].[get_py]
(
 @inputhz varchar(50),
 @flag int 	--1姓名 else 不按姓名查找
)
returns @jg table(xh int identity,pyzt varchar(40) null,pyall varchar(150) null)
--WITH ENCRYPTION
as
begin
  --生成姓名的拼音码
  declare @a table(id int identity,pyzt varchar(50) null,pyall varchar(150) null)
  declare @b table(id int identity,pyzt varchar(50) null,pyall varchar(150) null)

  declare @i integer		  --循环变量
  declare @hzlen integer	--字串总长度
  declare @hz varchar(2)	--当前的汉字

  set @hzlen=len(@inputhz)
  set @i=1
  insert into @a(pyzt,pyall) values('','')
  while @i<=@hzlen
    begin
      set @hz=substring(@inputhz,@i,1)
      if @hz='?' or @hz='?' or @hz='？'
        set @hz=''
      if @hz<>'' 
        begin
          delete @b
          if @flag=1 and @i=1 and (select count(*) from pub_hzpy where hz = @hz and isx=1)>0  
            insert into @b(pyzt,pyall) select  pysm,pym from pub_hzpy where hz = @hz and isx=1 order by sypd,id
          else
            insert into @b(pyzt,pyall) select  pysm,pym from pub_hzpy where hz = @hz order by sypd,id
          
          delete @jg
          insert into @jg(pyzt,pyall)
          select top 50 a.pyzt+b.pyzt,a.pyall+b.pyall from @a a,@b b
          delete @a
          insert into @a(pyzt,pyall) select pyzt,pyall from @jg
        end
      set @i=@i+1
    end
  return
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_qhmx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--返回编码名称+明细串

CREATE function  [dbo].[get_qhmx]
(
 @bm varchar(6),   --编码
 @mx varchar(60)   --明细
)
returns varchar(300)
as
begin
  declare @jg varchar(300),@lb varchar(4)
  set @jg=''
  
  if @bm<>''
    select top 1 @jg=mc,@lb=lb from pub_dmb where (lb='1C' or lb='1Z' or lb='1K') and bm=@bm
  
  if @lb='1Z'
    begin
      if @mx like left(@jg,2)+'%'
        set @jg=''
    end
  
    set @jg=@jg+isnull(@mx,'')
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_qklj_cs]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回前科/劣迹次数
--select top 1000 dbo.get_qklj_cs(zf_id,'3') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_qklj_cs]
(
 @zf_id varchar(50),
 @cs varchar(2)      --返回值形式参数  1:前科次数   2:劣迹次数   3:前科劣迹次数
)
returns tinyint
as
begin
	declare @jg tinyint
  
  if @cs='1'
    --前科次数
    select @jg=count(*) from zf_xscf where zf_id=@zf_id and cflb<>''
  else if @cs='2'
    --劣迹次数
    select @jg=count(*) from zf_zacf where zf_id=@zf_id and cflb<>''
  else if @cs='3'
    --前科劣迹次数
    set @jg=(select count(*) from zf_xscf where zf_id=@zf_id and cflb<>'')+
            (select count(*) from zf_zacf where zf_id=@zf_id and cflb<>'')
  
	return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_qklj_scfx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回上次刑事处罚/上次服刑信息(最后一次服刑信息)

/* 返回形式参数(@cs)：
1  上次刑事处罚止日8位数字串，如：20081231
2  上次刑事处罚情况，如：盗窃 1年 2001.04至2002.04 执行机关：XX看守所/监狱

6  上次是否在本监狱服刑，    返回逻辑值：0否  1是
7  上次是否在本分局监狱服刑，返回逻辑值：0否  1是
8  上次是否在本省监狱服刑，  返回逻辑值：0否  1是
*/

--select top 1000 dbo.get_qklj_scfx(zf_id,'1',gydw) as a  from zf_jbxx where zybz='1' order by a desc

CREATE function [dbo].[get_qklj_scfx]
(
 @zf_id varchar(50),
 @cs varchar(6),    --返回值形式
 @dwbm varchar(4)   --用户单位编码(此参数必须传)
)
returns varchar(200)
as
begin
  declare @jg varchar(200)
  set @jg=''
  
  if @cs='1'
    --上次刑罚止日
    select top 1 @jg=convert(varchar(8),zr,112) from zf_xscf where zf_id=@zf_id and cflb<>'' order by xh desc
  else if @cs='2'
    --上次刑罚情况
    select top 1 @jg=(case when not (zmmc='' or zmmc is null or xq='' or xq is null) then isnull(zmmc,'')+' '+dbo.get_mask_xq(xq,2,'')+' ' else '' end)+
                     (case when isdate(qr)=1 and isdate(zr)=1 then dbo.get_mask_date(qr,1,4)+'至'+dbo.get_mask_date(zr,1,4)+' ' else '' end)+
                     (case when (zxjgqh+zxjgmx='' or zxjgqh+zxjgmx is null) then '' else '执行机关:'+dbo.get_qhmx(zxjgqh,zxjgmx) end)
      from zf_xscf where zf_id=@zf_id and cflb<>'' order by xh desc
  else if @cs in ('6','7','8')
    begin
      declare @zxjgqh varchar(6),@cflb varchar(2)
      set @jg='0'
      
      --读取上次刑罚执行机关、刑罚类别
      select top 1 @zxjgqh=zxjgqh,@cflb=cflb from zf_xscf where zf_id=@zf_id and cflb<>'' order by xh desc
      
      if @cflb='4'
        --服刑
        begin
          if @cflb='4' and @cs='6' and @zxjgqh=@dwbm
            --上次是否在本监狱服刑
            set @jg='1'
          if @cflb='4' and @cs='7'
            --上次是否在本分局服刑
            begin
              if exists (select 1 from pub_jyxx where sjdm=@zxjgqh)
                set @jg='1'
            end
          if @cflb='4' and @cs='8' and @zxjgqh like left(@dwbm,2)+'%'
            --上次是否在本省监狱服刑
            set @jg='1'
        end
    end
    
  return @jg
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_qklj_xx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回前科劣迹次数/前科劣迹情况

/* 返回值形式参数说明
1  前科类别及次数  格式“拘役1次 服刑2次”
2  劣迹类别及次数  格式“戒毒2次 劳教1次”
3  前科劣迹类别及次数  格式“拘役1次 服刑2次 劳教1次 戒毒2次”

4  前科情况  格式“1995年1月因抢劫判处有期徒刑3年，执行机关XX监狱；2001年3月因盗窃判处有期徒刑3年”
4H 前科情况，用换行符替换分号

5  劣迹情况  格式“1995年1月因吸毒劳教1年，执行机关XX劳教所；2001年3月因盗窃劳教3年”
6H 劣迹情况，用换行符替换分号

6  前科及劣迹情况，如“1995年1月因吸毒判处劳教2年，执行机关XX劳教所；2001年3月因盗窃判处有期徒刑3年”
6H 前科及劣迹情况，用换行符替换分号

7  上次刑罚执行机关
8  上次治安处罚执行机关
*/

--select top 1000 dbo.get_qklj_xx(zf_id,'4','') from zf_jbxx where zybz='1'

CREATE   function [dbo].[get_qklj_xx]
(
 @zf_id varchar(50),
 @cs varchar(3),     --返回值形式参数
 @dwbm varchar(6)    --用户单位编码（用于用户特殊需求）
)
returns varchar(2000)
as
begin
	declare @jg varchar(2000),@cr varchar(2)
  set @jg=''
  
  if @cs='1'
    --前科类别及次数  格式“拘役1次 服刑2次”
    select @jg=@jg+(case when @jg='' then '' else ' ' end)+xflb_mc+cast(cs as varchar(3))+'次'
      from (select cflb,dbo.get_mc('29',cflb) as xflb_mc,count(*) as cs from zf_xscf where zf_id=@zf_id and cflb<>'' group by cflb,dbo.get_mc('29',cflb)) t
      order by cflb
  else if @cs='2'
    --劣迹类别及次数  格式“劳教1次 戒毒2次”
    select @jg=@jg+(case when @jg='' then '' else ' ' end)+xflb_mc+cast(cs as varchar(3))+'次'
      from (select cflb,dbo.get_mc('2O',cflb) as xflb_mc,count(*) as cs from zf_zacf where zf_id=@zf_id and cflb<>'' group by cflb,dbo.get_mc('29',cflb)) t
      order by cflb
  else if @cs='3'
    --前科劣迹类别及次数  格式“拘役1次 服刑2次 劳教1次 戒毒2次”
    select @jg=@jg+(case when @jg='' then '' else ' ' end)+xflb_mc+cast(cs as varchar(3))+'次'
      from (select '1'+cflb as cflb,dbo.get_mc('29',cflb) as xflb_mc,count(*) as cs from zf_xscf where zf_id=@zf_id and cflb<>'' group by cflb,dbo.get_mc('29',cflb)
            union all
            select '2'+cflb as cflb,dbo.get_mc('2O',cflb) as xflb_mc,count(*) as cs from zf_zacf where zf_id=@zf_id and cflb<>'' group by cflb,dbo.get_mc('29',cflb)) t
      order by cflb
  else if @cs like '4%'
    --前科情况
    begin
      set @cr=(case when @cs like '%H%' then char(10) else '；' end)  --记录之间符号
      select @jg=@jg+(case when @jg='' then '' else @cr end)+
                     (case when pjrq<>'' then dbo.get_mask_date_c(pjrq,2,4) else '' end)+
                     (case when zmmc<>'' then '因'+zmmc else '' end)+
                     (case when cflb='4' then (case when isnumeric(ypxq)=1 then dbo.get_mask_xq(ypxq,2,'判处') else '判处有期徒刑' end)
                           else '判处'+dbo.get_mc('29',cflb) end)+
                     (case when isnumeric(xq)=1 then (case when cflb='4' then (case when isnumeric(ypxq)=1 then ',实际执行刑期' else ',执行刑期' end)
                                                           else ',刑期' end)+dbo.get_mask_xq(xq,2,'')
                           else '' end)+
                     (case when qr is not null and zr is not null then ',自'+dbo.get_mask_date(qr,1,4)+'至'+dbo.get_mask_date(zr,1,4)
                           when zr is not null then ',止日'+dbo.get_mask_date(zr,1,4) 
                           else '' end)+
                     (case when cflb in ('2','4') and (zxjgqh<>'' or zxjgmx<>'') then ',执行机关:'+dbo.get_qhmx(zxjgqh,zxjgmx)
                           else '' end)
        from zf_xscf where zf_id=@zf_id and cflb<>'' order by xh
    end
  else if @cs like '5%'
    --劣迹情况
    begin
      set @cr=(case when @cs like '%H%' then char(10) else '；' end)  --记录之间符号
      select @jg=@jg+(case when @jg='' then '' else @cr end)+
                     (case when cfrq<>'' then dbo.get_mask_date_c(cfrq,2,4) else '' end)+
                     (case when zmmc<>'' and cflb<>'3' then '因'+zmmc else '' end)+
                     (case when cflb='9' then '治安处罚' else dbo.get_mc('2O',cflb) end)+
                     (case when isnumeric(xq)=1 then ',期限'+dbo.get_mask_xq(xq,2,'')
                           else '' end)+
                     (case when qr is not null and zr is not null then ',自'+dbo.get_mask_date(qr,1,4)+'至'+dbo.get_mask_date(zr,1,4)
                           when zr is not null then ',止日'+dbo.get_mask_date(zr,1,4) 
                           else '' end)+
                     (case when cflb in ('1','2','3') and (zxjgqh<>'' or zxjgmx<>'') then ',执行机关:'+dbo.get_qhmx(zxjgqh,zxjgmx)
                           else '' end)
        from zf_zacf where zf_id=@zf_id and cflb<>'' order by xh
    end
  else if @cs like '6%'
    begin
      --前科及劣迹详细情况
      set @cr=(case when @cs like '%H%' then char(10) else '；' end)  --记录之间符号
      select @jg=@jg+(case when @jg='' then '' else @cr end)+
                     (case when pjrq<>'' then dbo.get_mask_date_c(pjrq,2,4) else '' end)+
                     (case when zmmc<>'' and not (lb='2' and cflb='3') then '因'+zmmc else '' end)+
                     (case when lb='1' and cflb='4' then (case when isnumeric(ypxq)=1 then dbo.get_mask_xq(ypxq,2,'判处') else '判处有期徒刑' end)
                           when lb='2' and cflb='9' then '治安处罚'
                           when lb='1' then '判处'+dbo.get_mc('29',cflb)
                           else dbo.get_mc('2O',cflb) end)+
                     (case when lb='1' and isnumeric(xq)=1 and cflb='4' then (case when isnumeric(ypxq)=1 then ',实际执行刑期' else ',执行刑期' end)+dbo.get_mask_xq(xq,2,'')
                           when lb='1' and isnumeric(xq)=1 then ',刑期'
                           when lb='2' and isnumeric(xq)=1 then ',期限'+dbo.get_mask_xq(xq,2,'')
                           else '' end)+
                     (case when qr is not null and zr is not null then ',自'+dbo.get_mask_date(qr,1,4)+'至'+dbo.get_mask_date(zr,1,4)
                           when zr is not null then ',止日'+dbo.get_mask_date(zr,1,4) 
                           else '' end)+
                     (case when lb='1' and cflb in ('2','4') and (zxjgqh<>'' or zxjgmx<>'') then ',执行机关:'+dbo.get_qhmx(zxjgqh,zxjgmx)
                           when lb='2' and cflb in ('1','2','3') and (zxjgqh<>'' or zxjgmx<>'') then ',执行机关:'+dbo.get_qhmx(zxjgqh,zxjgmx)
                           else '' end)
        from (select '1' as lb,cflb,pjrq,ypxq,xq,qr,zr,zmmc,zxjgqh,zxjgmx from zf_xscf where zf_id=@zf_id and cflb<>''
              union
              select '2' as lb,cflb,cfrq,'',xq,qr,zr,zmmc,zxjgqh,zxjgmx from zf_zacf where zf_id=@zf_id and cflb<>'') as jwcf
        order by pjrq
    end
  else if @cs='7'
    begin
      --上次刑罚执行地
      select top 1 @jg=dbo.get_qhmx(zxjgqh,zxjgmx) from zf_xscf where zf_id=@zf_id order by xh desc
    end
  else if @cs='8'
    begin
      --上次治安处罚执行地
      select top 1 @jg=dbo.get_qhmx(zxjgqh,zxjgmx) from zf_zacf where zf_id=@zf_id order by xh desc
    end

	return @jg
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_qqdh]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回：主联系人及电话、亲情电话号码

--select top 1000 dbo.get_qqdh(zf_id,'1') from zf_jbxx where zybz='1'

CREATE  function [dbo].[get_qqdh]
(
 @zf_id varchar(50),
 @cs char(1)       --标记，0：全部亲情电话，1：主联系人及电话
)
returns varchar(500)

as
begin
  declare @jg varchar(500)
  set @jg = ''	
  if @cs = '1'
    begin
      select @jg=@jg+(case when @jg='' then '' else '；' end)+isnull(gx,'')+' '+xm+(case when dh<>'' then ' 电话:'+dh else '' end)
        from zf_shgx where zf_id=@zf_id and zlxr=1 and xm<>''
      if @jg=''
        select top 1 @jg=isnull(gx,'')+' '+xm+(case when dh<>'' then ' 电话:'+dh else '' end)
          from zf_shgx where zf_id=@zf_id and xm<>'' order by xh
    end
  else
    select  @jg=@jg+(case when @jg='' then '' else '；' end)+isnull(gx,'')+' '+xm+' 电话:'+dh
      from zf_shgx where zf_id=@zf_id and qqdh=1 and dh<>'' order by xh
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_qr]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回刑期起日
--select top 1000 dbo.get_qr(zf_id,null,'0') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_qr]
(
 @zf_id varchar(50),
 @jzrq datetime,    --截止日期(传NULL 表示当前日期)
 @cs varchar(2)     --返回值格式参数  0：返回日期字符串20050908   1：返回2005.09.08   2：返回2005年9月8日
)
returns varchar(40)
as
begin
  declare @jg varchar(40)
  
  if @jzrq is null
    --读取最新起日
    select top 1 @jg=convert(varchar(8),qr,112) from zf_xfzb where zf_id=@zf_id and flag='1'
  else
    --读取截止日期前的起日
    select top 1 @jg=convert(varchar(8),qr,112) from zf_xfzb where zf_id=@zf_id and pcrq<=@jzrq and pcrq>=(select pcrq from zf_xfzb where zf_id=@zf_id and iszs='1') order by pcrq desc,cjsj desc
  
  if @jg is null
    set @jg=''
  else if @cs in ('1','2')
    begin
      if @cs='1'
         --2005.01.01的形式
        set @jg=left(@jg,4)+'.'+substring(@jg,5,2)+'.'+substring(@jg,7,2)
      else if @cs='2'
        --2005年1月1日的形式
        set @jg=left(@jg,4)+'年'+cast(cast(substring(@jg,5,2) as int) as varchar(2))+'月'+cast(cast(substring(@jg,7,2) as int) as varchar(2))+'日'
    end
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_qtch]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回顿号分隔的罪犯其它称呼串

/* 返回值格式参数说明
空：返回所有称呼串（英文名、别化名、绰号后无类别说明，其他类别有类别说明） 如：大头、张月(曾用名)
A:  返回所有称呼串（每个称呼后均无类别说明）
AL: 返回所有称呼串（每个称呼后均有类别说明）
Y:  仅返回英文名
Z:  仅返回自报名
*/

--select top 1000 dbo.get_qtch(zf_id,'','') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_qtch] 
(
 @zf_id varchar(50),  --罪犯ID
 @cs varchar(4),      --返回值形式参数
 @dwbm varchar(4)     --用户单位编码（用于用户特殊需求）
)
returns varchar(100)
as
begin
	declare @jg varchar(100)
	set @jg=''
  
  if @cs='' or @cs is null
    --全部称呼串（英文名、别化名、绰号后无类别说明）
    select @jg=@jg+(case when @jg='' then '' else '、' end)+bhm+(case when lb in ('2','3','4','5') then '' else '('+dbo.get_mc('17',lb)+')' end)
      from zf_qtch where zf_id=@zf_id and not (bhm='' or bhm is null) order by xh
  else if @cs='A'
    --全部称呼串（称呼后均无类别说明）
    select @jg=@jg+(case when @jg='' then '' else '、' end)+bhm
      from zf_qtch where zf_id=@zf_id and not (bhm='' or bhm is null) order by xh
  else if @cs='AL'
    --全部称呼串（称呼后均有类别说明）
    select @jg=@jg+(case when @jg='' then '' else '、' end)+bhm+'('+dbo.get_mc('17',lb)+')'
      from zf_qtch where zf_id=@zf_id and not (bhm='' or bhm is null) order by xh
  else if @cs='Z'
    --自报名
    select @jg=@jg+(case when @jg='' then '' else '、' end)+bhm
      from zf_qtch where zf_id=@zf_id and not (bhm='' or bhm is null) and lb='1'
  else if @cs='Y'
    --英文名
    select @jg=@jg+(case when @jg='' then '' else '、' end)+bhm
      from zf_qtch where zf_id=@zf_id and not (bhm='' or bhm is null) and lb='2'
  
	return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_scjjxjg]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




--返回上次加减刑距今时间间隔（若无加减刑，返回终审判决距今间隔）
--select top 100 zf_id,dbo.get_scjjxjg(zf_id,null,'2','') from zf_jbxx where zybz='1'

CREATE    function [dbo].[get_scjjxjg]
(
 @zf_id varchar(50),
 @jzrqs datetime,   --截止日期（NULL表示当前日期）
 @cs varchar(2),    --返回格式 1：020405(用于条件)  2：02_04_15(2005.12.12减刑/加刑/判决)(用于显示) 2C：2年4个月15天(2005.12.12减刑/加刑/判决)  
 @dwbm varchar(6)   --用户单位编码
)
returns varchar(60)
as
begin
  declare @jg varchar(60),@pcrq datetime,@s varchar(20),@jzrq datetime
  set @jg=''
  
  if @jzrqs is null
    select @jzrq=output from vw_today
  else
    set @jzrq=@jzrqs
  
  select top 1 @pcrq=pcrq,@s=(case when bdlb in ('7','8','10') then '减刑' when bdlb='18' then '撤销减刑' else '加刑' end)
    from zf_xfzb where zf_id=@zf_id and pcrq<=@jzrq and bdlb in ('3','4','5','6','7','8','10','18') order by pcrq desc,cjsj desc
  
  if @pcrq is null
    --无加减刑记录，读取原判判决日期
    select top 1 @pcrq=pcrq,@s='终审判决' from zf_xfzb where zf_id=@zf_id and iszs='1'
  
  set @jg=dbo.get_sjjg(@pcrq,@jzrq)
  if @cs like '%2%' and @jg<>''
    begin
      if @cs like '%C%'
        set @jg=dbo.get_mask_xq(@jg,2,'')+'('+convert(varchar(10),@pcrq,102)+@s+')'
      else
        set @jg=left(@jg,2)+'_'+substring(@jg,3,2)+'_'+right(@jg,2)+'('+convert(varchar(10),@pcrq,102)+@s+')'
    end
  
  return @jg
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_sfbm]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回是否身份不明编码或名称

/* 返回形式参数(cs)
1 返回编码: 0身份明 1身份不明
2 返回名称，身份明返回空串，身份不明返回如:“身份不明(未查明)”、“身份不明(已查明)”
3 返回名称，身份明返回空串，身份不明返回如:“未查明”、“已查明”
*/

--select dbo.get_sfbm(zf_id,'2','') from zf_jbxx where zybz='1'

CREATE  function [dbo].[get_sfbm]
(
 @zf_id varchar(50),
 @cs varchar(6),     --返回值形式
 @dwbm varchar(4)    --用户单位编码(用于用户特殊需求)
)
returns varchar(40)

as
begin
	declare @jg varchar(40)
	set @jg=(case when @cs='1' then '0' else '' end)
  
  if exists (select 1 from zf_tbgz where zf_id=@zf_id and tbgzlb='9')
    begin
      set @jg=(case when @cs='1' then '1' when @cs='2' then '身份不明' else '' end)
      if @cs in ('2','3')
        begin
          declare @zsxm varchar(50)
          select @zsxm=zsxm from zf_jbxx where zf_id=@zf_id  --读取真实姓名
          if not (@zsxm='' or @zsxm is null)
            set @jg=@jg+(case when @cs='2' then '(已查明)' else '已查明' end)
          else
            set @jg=@jg+(case when @cs='2' then '(未查明)' else '未查明' end)
        end
    end
	return @jg
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_sfzh]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO


--返回证件号码及证件类型串

--select top 100 dbo.get_sfzh(zf_id,'1','') from zf_jbxx where zybz='1' and exists (select 1 from zf_zj where zf_id=zf_jbxx.zf_id)

CREATE function [dbo].[get_sfzh] 
(
 @zf_id varchar(50),
 @cs varchar(10),    --返回值格式参数 1:居民身份证只返回号码，不返回名称，其它证件返回名称  2：所有证件均返回证件类型
 @dwbm varchar(4)    --用户单位编码（用于用户特殊需求）
)
returns varchar(100)

as
begin
	declare @jg varchar(100)
	set @jg=''
  
  if @cs='1'
    --居民身份证不返回名称，其它证件返回名称
    select @jg=@jg+(case when @jg='' then '' else '、' end)+zjhm+
                   (case when zjlx not in ('1','2') and not (zjhm='' or zjlx='' or zjlx is null) then '('+dbo.get_mc('30',zjlx)+') ' else '' end)
      from zf_zj where zf_id=@zf_id and zjhm<>'' order by xh
  else
    --所有证件均返回证件类型
    select @jg=@jg+(case when @jg='' then '' else '、' end)+zjhm+
                   (case when not (zjhm='' or zjlx='' or zjlx is null) then '('+dbo.get_mc('30',zjlx)+') ' else '' end)
      from zf_zj where zf_id=@zf_id and zjhm<>'' order by xh
  
	return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_shgx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回：社会关系串、主联系人情况串
--select top 100 dbo.get_shgx(zf_id,'3',null,'') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_shgx]
(
 @zf_id varchar(50),
 @cs varchar(2),     --返回形式，1：全部社会关系串，2：所有主联系人情况  3：第一名主联系人情况
 @rq datetime,       --计算关系人年龄用的截止日期（NULL表示当日日期）
 @dwbm varchar(6)    --单位编码（用于用户特殊需求）
)
returns varchar(200)
as
begin
  declare @jg varchar(2000),@jzrq datetime
  set @jg = ''	
  
  if @rq is null
    select @jzrq=output from vw_today
  else
    set @jzrq=@rq
  
  if @cs = '1'
    --全部社会关系
    select  @jg=@jg+(case when @jg='' then '' else '；' end)+
                isnull(gx,'')+' '+xm+
                (case when csrq is null or @jzrq<=csrq then '' else ' '+cast(dbo.get_nl(csrq,@jzrq) as varchar(4))+'岁' end)+
                (case when isnull(jtqh,'')='' and isnull(jtmx,'')='' then '' else ' 住址:'+dbo.get_qhmx(jtqh,jtmx) end)+
                (case when isnull(dwqh,'')='' and isnull(dwmx,'')='' then '' else ' 单位:'+dbo.get_qhmx(dwqh,dwmx) end)+
                (case when isnull(zy,'')='' then '' else ' '+zy end)+
                (case when isnull(zw,'')='' then '' else ' '+zw end)
      from zf_shgx where zf_id=@zf_id and xm<>'' order by xh
  else if @cs='2'
    --所有主联系人
    select  @jg=@jg+(case when @jg='' then '' else '；' end)+
                isnull(gx,'')+' '+xm+
                (case when csrq is null or @jzrq<=csrq then '' else ' '+cast(dbo.get_nl(csrq,@jzrq) as varchar(4))+'岁' end)+
                (case when isnull(jtqh,'')='' and isnull(jtmx,'')='' then '' else ' 住址:'+dbo.get_qhmx(jtqh,jtmx) end)+
                (case when isnull(dwqh,'')='' and isnull(dwmx,'')='' then '' else ' 单位:'+dbo.get_qhmx(dwqh,dwmx) end)+
                (case when isnull(zy,'')='' then '' else ' '+zy end)+
                (case when isnull(zw,'')='' then '' else ' '+zw end)
      from zf_shgx where zf_id=@zf_id and zlxr=1 and xm<>'' order by xh
  else if @cs='3'
    --第一名主联系人
    select top 1 @jg=@jg+(case when @jg='' then '' else '；' end)+
                isnull(gx,'')+' '+xm+
                (case when csrq is null or @jzrq<=csrq then '' else ' '+cast(dbo.get_nl(csrq,@jzrq) as varchar(4))+'岁' end)+
                (case when isnull(jtqh,'')='' and isnull(jtmx,'')='' then '' else ' 住址:'+dbo.get_qhmx(jtqh,jtmx) end)+
                (case when isnull(dwqh,'')='' and isnull(dwmx,'')='' then '' else ' 单位:'+dbo.get_qhmx(dwqh,dwmx) end)+
                (case when isnull(zy,'')='' then '' else ' '+zy end)+
                (case when isnull(zw,'')='' then '' else ' '+zw end)
      from zf_shgx where zf_id=@zf_id and zlxr=1 and xm<>'' order by xh
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_shwq_wjx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--计算死缓/无期N年N月是否未减刑  返回值：1是（未减刑）  0否（不是死缓无期，或判决日期距截止日期不足N年N月）
--select zf_id,xm,dbo.get_shwq_wjx(zf_id,null,'0200','2','1','') from zf_jbxx where zybz='1' and dbo.get_shwq_wjx(zf_id,'20101231','2','0200','')=1

CREATE function [dbo].[get_shwq_wjx]
(
 @zf_id varchar(50),    --罪犯ID
 @jzrqs datetime,    --截止日期(NULL表示当前日期)
 @sjjg varchar(4),   --未减刑时间间隔：YYMM 如：0200
 @cs1   char(1),     --1：计算死缓N年N月是否未减刑  2：计算无期N年N月是否未减刑
 @cs2  varchar(2),   --未减刑起算日期  1终审判决日期  2执行通知书下达日期  3死缓复核日期
 @dwbm varchar(6)    --用户单位编码
)
returns tinyint
as
begin
  declare @jg tinyint,@jzrq datetime,@xq varchar(6),@pjrq datetime,@year tinyint,@month tinyint
  set @jg=0

  if @jzrqs is null
    select @jzrq=output from vw_today
  else
    set @jzrq=@jzrqs
  
  --读取截止日期前刑罚记录的判决日期/执行通知书日期/死缓复核日期
  if @cs2='2' or @dwbm like '44%'
    --广东省按执行通知书日期计算
    select top 1 @xq=a.xq,@pjrq=(case when a.zxrq is null then a.pcrq else a.zxrq end)
      from zf_xfzb a
      where a.zf_id=@zf_id and a.pcrq<=@jzrq and a.bdlb<>'21'
            and not exists (select 1 from zc_tt where zf_id=a.zf_id and (ttrq<=@jzrq or ttrq is null) and (bhrq>@jzrq or bhrq is null))
      order by a.pcrq desc,a.cjsj desc
  else if @cs2='1'
    --按判决日期计算
    select top 1 @xq=a.xq,@pjrq=a.pcrq
      from zf_xfzb a
      where a.zf_id=@zf_id and a.pcrq<=@jzrq and a.bdlb<>'21'
            and not exists (select 1 from zc_tt where zf_id=a.zf_id and (ttrq<=@jzrq or ttrq is null) and (bhrq>@jzrq or bhrq is null))
      order by a.pcrq desc,a.cjsj desc
  else
    --按死缓复核日期
    select top 1 @xq=a.xq,@pjrq=(case when b.fhrq is null then a.pcrq else b.fhrq end)
      from zf_xfzb a left join zf_xfzb_shfh b on a.oid=b.zf_xfzb_oid
      where a.zf_id=@zf_id and a.pcrq<=@jzrq and a.bdlb<>'21'
            and not exists (select 1 from zc_tt where zf_id=a.zf_id and (ttrq<=@jzrq or ttrq is null) and (bhrq>@jzrq or bhrq is null))
      order by a.pcrq desc,a.cjsj desc
    
  if @xq='9996' and @cs1='1' or @xq='9995' and @cs1='2'
    begin
      set @year=cast(left(@sjjg,2) as tinyint)
      set @month=cast(substring(@sjjg,3,2) as tinyint)
      if @month is null
        set @month=0
      if @pjrq<dateadd(month,-@month,dateadd(year,-@year,@jzrq))
        set @jg=1
    end
    
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_sjjg]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--函数功能：返回两个日期间隔的“年月天”串:‘020712’6位
--select dbo.get_sjjg('20020131','20020228')

CREATE FUNCTION  [dbo].[get_sjjg]
(
@qr datetime,
@zr datetime
)

RETURNS varchar(6)
AS
BEGIN
  declare @jg varchar(8),@year int,@month int,@day int,@days int
  set @jg=''
  
  if not (@zr<@qr or @qr is null or @zr is null)
    begin
      select @year=0,@month=0,@day=0,@days=0
      
      if day(@zr)+1>=day(@qr)  --止日天+1>=起日天
        begin
          set @day=day(@zr)+1-day(@qr)     --计算天数
          set @year=year(@zr)-year(@qr)    --计算年数
          set @month=month(@zr)-month(@qr) --计算月数
          if @month<0
            begin
              set @year=@year-1
              set @month=@month+12
            end
        end
      else   --止日天+1<起日天
        begin
          --求起日所在月的天数
          if month(@qr)=2
            --2月总天数
            set @days=day(dateadd(dd,-1,cast(year(@qr) as varchar(4))+'0301'))
          else
            --其他月总天数
            set @days=(case when month(@qr) in (4,6,9,11) then 30 else 31 end)
          
          set @day=day(@zr)+@days-day(@qr)   --计算天数
          set @year=year(@zr)-year(@qr)      --计算年数
          set @month=month(@zr)-month(@qr)-1 --计算月数
          if @month<0
            begin
              set @year=@year-1
              set @month=@month+12
            end
        end
      
      --求止日所在月的天数
      if month(@zr)=2
        --2月总天数
        set @days=day(dateadd(d,-1,cast(year(@zr) as varchar(4))+'0301'))
      else
        --其他月总天数
        set @days=(case when month(@zr) in (4,6,9,11) then 30 else 31 end)

      if @day=@days  --天数=止日所在月的天数,进月
        begin
          set @day=0
          set @month=@month+1
          if @month>=12
            begin
              set @month=@month-12
              set @year=@year+1
            end
        end

      set @jg=right(cast(100+@year as varchar(3)),2)+right(cast(100+@month as varchar(3)),2)+right(cast(100+@day as varchar(3)),2)
    end

  return @jg
END




GO
/****** Object:  UserDefinedFunction [dbo].[get_st]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回截止日期时三停情况，格式：停会见(2012.03.12至2012.03.25)
--select dbo.get_st(zf_id,'20101220') from zf_jbxx where zybz='1' and exists (select 1 from zf_st where zf_id=zf_jbxx.zf_id)

CREATE function [dbo].[get_st]
(
 @zf_id varchar(50),
 @jzrqs datetime    --截止日期（NULL表示当前日期）
)
returns varchar(100)
as
begin
  declare @jg varchar (100),@jzrq datetime
  set @jg=''
  
  if @jzrqs is null
    select @jzrq=output from vw_today
  else
    set @jzrq=@jzrqs
  
  select @jg=@jg+(case when @jg='' then '' else '、' end)+
             dbo.get_mc('7B',stlb)+'('+dbo.get_mask_date(stqr,1,4)+'至'+dbo.get_mask_date(stzr,1,4)+')'
    from zf_st where zf_id=@zf_id and (stqr<=@jzrq or stqr is null) and (stzr>@jzrq or stzr is null) and stlb<>'' order by stqr
  
  return @jg
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_syxq]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回剩余刑期 格式：051023
--select a.zybz,b.zr,dbo.get_syxq(a.zf_id,b.xq,b.zr,null,a.zybz) from zf_jbxx a join zf_xfzb b on a.zf_id=b.zf_id and b.flag='1' where a.zybz='1'

CREATE  function [dbo].[get_syxq]
(
 @zf_id varchar(50),  --罪犯ID
 @xq varchar(6),  --刑期
 @zr datetime,    --刑期止日
 @jzrqs datetime, --截止日期(传NULL 表示当前日期)
 @zybz char(1)    --在押标志：1:在押  3:离监  0:由本函数判断
)
returns varchar(8)
as
begin
if @xq like '99%'
  return @xq  --无期/死缓
else
  begin
    declare @syxq varchar(8),@jzrq datetime,@yy int,@y1 int,@y2 int,@mm int,@m1 int,@m2 int,@m1_sy int,@dd int,@d1 int,@d2 int
    
    if @jzrqs is null
      select @jzrq=output from vw_today  --读取当日日期
    else
      set @jzrq=@jzrqs
    
    if @zybz='0'
      --截止日期时的在押标志变量赋值
      select top 1 @zybz=(case when (syrq<=@jzrq or syrq is null) and (ljrq>@jzrq or ljrq is null) then '1' else '3' end)
        from zf_crj where zf_id=@zf_id and (syrq<=@jzrq or syrq is null) order by syrq desc,cjsj desc

    if isnumeric(@xq)=0 or @zr is null or isnull(@zybz,'')<>'1' or @zr<=@jzrq
      return ''  --数据有问题 或 已离监 或 止日小于截止日期（如在逃）
    else
      begin
        set @y1=year(@zr)    --取止日“年”
        set @m1=month(@zr)   --取止日“月”
        set @d1=day(@zr)     --取止日“天”
        set @y2=year(@jzrq)  --取截止日“年”
        set @m2=month(@jzrq) --取截止日“月”
        set @d2=day(@jzrq)   --取截止日“天”
        set @yy=@y1-@y2  --余刑“年”
        set @mm=@m1-@m2  --余刑“月”
        if  @d1<@d2
          begin
            set @mm=@mm-1
            --求止日上个月的总天数
            set @m1_sy=@m1-1
            if @m1_sy=0
              set @m1_sy=12
            if @m1_sy=2
              --2月总天数
              set @m1_sy=(case when year(@zr)%4=0 then 29 else 28 end)
            else
              --其他月总天数
              set @m1_sy=(case when @m1_sy in (2,4,6,9,11) then 30 else 31 end)
            set @d1=@d1+@m1_sy  --止日“天”＋止日上个月的总天数
          end
        
        set @dd=@d1-@d2  --余刑“天”
        if  @mm<0
          begin
            set @yy=@yy-1
            set @mm=@mm+12
          end
        set @syxq=right(cast(100+@yy as varchar(3)),2)+right(cast(100+@mm as varchar(3)),2)+right(cast(100+@dd as varchar(3)),2)
      end
  end

return @syxq
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_syxq_byzfid]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--根据罪犯ID、截止日期，返回剩余刑期(不传入刑期、止日参数)，返回值格式：090123
--select dbo.get_syxq_byzfid(zf_id,'20121231') from zf_jbxx where zybz='1'

CREATE  function [dbo].[get_syxq_byzfid]
(
 @zf_id varchar(50),
 @jzrqs datetime     --截止日期(传NULL 表示当前日期)
)
returns varchar(8)
as
begin
  declare @syxq varchar(6),@jzrq datetime,@xq varchar(6),@zr datetime,@zybz char(1)

  if @jzrqs is null
    begin
      --读取罪犯当前刑期、止日、在押标志  
      select @xq=b.xq,@zr=b.zr,@zybz=a.zybz from zf_jbxx a join zf_xfzb b on a.zf_id=b.zf_id where a.zf_id=@zf_id and b.flag='1'
      --读取当前日期
      select @jzrq=output from vw_today
    end
  else
    begin
      --读取截止日期时的罪犯刑期、止日、在押标志
      set @jzrq=@jzrqs
      select top 1 @xq=xq,@zr=zr from zf_xfzb where zf_id=@zf_id and (pcrq<=@jzrq or pcrq is null) order by pcrq desc,cjsj desc
      select top 1 @zybz=(case when syrq<=@jzrq and (ljrq>@jzrq or ljrq is null) then '1' else '3' end)
        from zf_crj where zf_id=@zf_id and (syrq<=@jzrq or syrq is null) order by syrq desc,cjsj desc
    end
  
  if @xq like '99%'
    return @xq    --无期/死缓
  else if isnumeric(@xq)=0 or @zr is null or @zr<=@jzrq or @zybz='3' or @zybz is null
    return ''     --数据有问题/止日小于截止日期/已离监
  else
    begin
      declare @yy int,@y1 int,@y2 int,@mm int,@m1 int,@m2 int,@m1_sy int,@dd int,@d1 int,@d2 int
      set @y1=year(@zr)    --取止日“年”
      set @m1=month(@zr)   --取止日“月”
      set @d1=day(@zr)     --取止日“天”
      set @y2=year(@jzrq)  --取截止日“年”
      set @m2=month(@jzrq) --取截止日“月”
      set @d2=day(@jzrq)   --取截止日“天”
      set @yy=@y1-@y2    --余刑“年”
      set @mm=@m1-@m2    --余刑“月”
      if  @d1<@d2
        begin
          set @mm=@mm-1
          --求止日上个月的总天数
          set @m1_sy=@m1-1 --上月的月份
          if @m1_sy=0
            set @m1_sy=12
          if @m1_sy=2
            --2月总天数
            set @m1_sy=(case when year(@zr)%4=0 then 29 else 28 end)
          else
            --其他月总天数
            set @m1_sy=(case when @m1_sy in (4,6,9,11) then 30 else 31 end)
          set @d1=@d1+@m1_sy  --止日“天”＋止日上个月的总天数
        end
        
      set @dd=@d1-@d2  --余刑“天”
      if  @mm<0
        begin
          set @yy=@yy-1
          set @mm=@mm+12
        end
      set @syxq=right(cast(100+@yy as varchar(3)),2)+right(cast(100+@mm as varchar(3)),2)+right(cast(100+@dd as varchar(3)),2)
    end

  return @syxq
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_syzt]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回实押状态的编码或名称

/* 返回值形式(@cs)
1  返回编码: 1(实押)  0(非实押) (用于条件)
2  返回名称：实押返回：狱内关押  非实押返回：监外执行/解回再审/在逃/住院/离监类别名称
2A 返回名称，在名称后附加日期及说明，如：监外执行(2001.01.01批准)
*/

--select dbo.get_syzt(zf_id,null,'1','') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_syzt]
(
 @zf_id varchar(50),
 @jzrqs datetime,     --截止日期(NULL 表示当前日期)
 @cs varchar(4),      --返回值形式：1：返回编码（1或0）  2返回名称（实押返回：狱内关押/住院  非实押返回：离监探亲/监外执行/解回再审/离监类别名称） 2A：返回名称，在名称后附加日期及说明，如“监外执行(2001.01.01批准)”
 @dwbm varchar(4)     --用户单位编码(用于用户特殊需求)
)
returns varchar(60)
as
begin
  declare @jg varchar(50),@jwzx_oid varchar(50),@jzrq datetime
  set @jg=''
  
  if @jzrqs is null
    --无截止日期
    begin
      if (select zybz from zf_jbxx where zf_id=@zf_id)='3'
      --已离监
        begin
          select @jg=(case when @cs='1' then '0' else (case when @cs='2A' and ljrq is not null then convert(varchar(8),ljrq,112) else '' end)+dbo.get_mc('1P',ljlb) end)
            from zf_crj where zf_id=@zf_id and GYDW_FLAG='1'
          if @jg='' or @jg is null
            set @jg=(case when @cs='1' then '0' else '离监' end)
        end
      set @jzrq='99991231'
    end
  else
    --有截止日期
    begin
      declare @syrq datetime,@ljrq datetime,@ljlb varchar(4)
      select top 1 @syrq=syrq,@ljrq=ljrq,@ljlb=ljlb
        from zf_crj where zf_id=@zf_id and (syrq<=@jzrq or syrq is null) order by syrq desc,cjsj desc
      if @ljrq>=@jzrq
        begin
          --已离监
          set @jg=(case when @cs='1' then '0' else (case when @cs='2A' then convert(varchar(8),@ljrq,112) else '' end)+dbo.get_mc('1P',@ljlb) end)
          if @jg='' or @jg is null
            set @jg=(case when @cs='1' then '0' else '离监' end)
        end
    end

  if @jg=''  --在押
    begin
      if @cs='1'
        --返回编码
        begin
          set @jg='1'  --默认实押
          --判断是否监外执行/解回/在逃/离监探亲/住院
          if exists (select 1 from zf_jwzx where zf_id=@zf_id and (zxrq<=@jzrq or zxrq is null) and (zzrq is null or zzrq>@jzrq))    --监外执行
             or exists (select 1 from zf_jhzs where zf_id=@zf_id and (tjrq<=@jzrq or tjrq is null) and (zzrq is null or zzrq>@jzrq)) --解回再审
             or exists (select 1 from zc_tt   where zf_id=@zf_id and (ttrq<=@jzrq or ttrq is null) and (bhrq is null or bhrq>@jzrq)) --在逃
             or exists (select 1 from zf_ljtq where zf_id=@zf_id and (jqqr<=@jzrq or jqqr is null) and (gjrq is null or gjrq>@jzrq)) --离监探亲
             or exists (select 1 from sw_jbyl where zf_id=@zf_id and (jzzyrq<=@jzrq or jzzyrq is null) and (cyrq is null or cyrq>@jzrq) and jzlb in ('6','7','8')) --住院
            set @jg='0'  --非实押
        end
      else
        --返回名称
        begin
          --是否监外执行
          select top 1 @jwzx_oid=oid from zf_jwzx where zf_id=@zf_id and (zxrq<=@jzrq or zxrq is null) and (zzrq is null or zzrq>@jzrq) order by zxrq
          if @jwzx_oid is not null
            begin
              --从监外执行续保表读取执行类别
              select top 1 @jg=(case when b.zxlb<>'1' then '监外执行：' else '' end)+dbo.get_mc('1T',b.zxlb)+(case when @cs='2A' and a.pzrq is not null then '('+convert(varchar(10),a.pzrq,102)+'批准)' else '' end)
                from zf_jwzx a join zf_jwzx_xb b on a.oid=b.zf_jwzx_oid where a.oid=@jwzx_oid order by b.pzrq desc
              if @jg='' or @jg is null
                --无续保记录，从监外执行主表读取执行类别
                select @jg=(case when zxlb<>'1' then '监外执行：' else '' end)+dbo.get_mc('1T',zxlb)+(case when @cs='2A' and pzrq is not null then '('+convert(varchar(10),pzrq,102)+'批准)' else '' end)
                  from zf_jwzx where oid=@jwzx_oid
              --从脱管表读取数据
              if @cs='2A'
                select top 1 @jg=replace(@jg,'批准','批准,'+convert(varchar(10),tgqr,102)+'脱管')
                  from zf_jwzx_tg where zf_jwzx_oid=@jwzx_oid and tgqr is not null and tgzr is null
            end
          if @jg=''
            --是否解回
            select top 1 @jg='解回再审'+(case when @cs='2A' and tjrq is not null then '('+isnull(dwqh,'')+isnull(dwmx,'')+convert(varchar(10),tjrq,102)+'提解)' else '' end)
              from zf_jhzs where zf_id=@zf_id and (tjrq<=@jzrq or tjrq is null) and (zzrq is null or zzrq>@jzrq) order by tjrq desc
          if @jg=''
            --是否在逃
            select top 1 @jg='在逃'+(case when @cs='2A' and ttrq is not null then '('+convert(varchar(10),ttrq,102)+'脱逃)' else '' end)
              from zc_tt where zf_id=@zf_id and (ttrq<=@jzrq  or ttrq is null) and (bhrq is null or bhrq>@jzrq) order by ttrq desc
          if @jg=''
            --判断是否离监探亲
            select top 1 @jg='离监探亲'+(case when @cs='2A' and jqqr is not null then '('+convert(varchar(10),pzrq,102)+'批准)' else '' end)
              from zf_ljtq where zf_id=@zf_id and (jqqr<=@jzrq or jqqr is null) and (gjrq is null or gjrq>@jzrq) order by jqqr desc
          if @jg=''
            --判断是否出监住院
            select top 1 @jg=dbo.get_mc('7K',jzlb)+(case when @cs='2A' and jzzyrq is not null then '('+convert(varchar(10),jzzyrq,102)+yymc+'就诊)' else '' end)
              from sw_jbyl where zf_id=@zf_id and jzlb in ('6','7','8') and (jzzyrq<=@jzrq or jzzyrq is null) and (cyrq is null or cyrq>@jzrq) order by jzzyrq desc
          if @jg='' or @jg is null
            set @jg=(case when @cs='1' then '1' else '狱内关押' end)
        end
    end
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_taf]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回同案犯串
--select top 1000 dbo.get_taf(zf_id,null,'2','2','1100') from zf_jbxx where zybz='1'

CREATE  FUNCTION [dbo].[get_taf]
(
 @zf_id varchar(50), --罪犯ID
 @jzrq datetime,     --截止日期（NULL表示当前日期）
 @cs varchar(2),     --返回值形式  1:返回 姓名（队别、现状）  2返回 姓名（现状）  附加参数 H:每记录后加换行符号
 @dwjb varchar(2),   --用户单位级别
 @dwbm varchar(6)    --用户单位编码
)
returns varchar(1000)
as
begin
  declare @jg varchar(1000),@cr char(1),@ysqh varchar(100),@ysmx varchar(100),@ysnd smallint,@yszh varchar(50),@ysxh varchar(50),@bmlb varchar(3)
  set @jg=''
  
  --读取一审机关、一审字号5个字段
  select top 1 @ysqh=isnull(pcqh,''),@ysmx=pcmx,@ysnd=pcnd,@yszh=pczh,@ysxh=pcxh from zf_xfzb where zf_id=@zf_id and bdlb='22'  --22为一审编码
  
  if @ysmx<>'' and @ysnd>0 and @yszh<>'' and @ysmx<>''
    begin
      set @bmlb=(case when @dwjb in ('1','3','4') then '1Z' else '1U' end)
      if @cs like '1%'
        --返回同案犯的姓名、现队别及现状
        begin
          set @cr=(case when @cs like '%H%' then char(10) else ' ' end)
          if @jzrq is null
            --截止日期空
            select @jg=@jg+(case when @jg='' then '' else @cr end)+b.xm+
                       '('+dbo.get_mc(@bmlb,(case when @dwjb in ('1','3','4') then b.gydw else b.gyjq end))+' '+dbo.get_zyxz(b.zf_id,null,'2',b.zybz,@dwbm)+')'
              from (select zf_id from zf_xfzb where bdlb='22' and isnull(pcqh,'')=@ysqh and pcmx=@ysmx and pcnd=@ysnd and pczh=@yszh and pcxh=@ysxh and zf_id<>@zf_id
                    union
                    select zf_id from zf_jbxx_fb where isnull(yaysqh,'')=@ysqh and yaysmx=@ysmx and yaysnd=@ysnd and yayszh=@yszh and yaysxh=@ysxh and zf_id<>@zf_id) a join zf_jbxx b on a.zf_id=b.zf_id
          else
            --截止日期不空
            select @jg=@jg+(case when @jg='' then '' else @cr end)+b.xm+
                       '('+dbo.get_mc(@bmlb,dbo.get_db(b.zf_id,@jzrq,@dwjb,@dwbm))+' '+dbo.get_zyxz(b.zf_id,@jzrq,b.zybz,'2',@dwbm)+')'
              from (select zf_id from zf_xfzb where bdlb='22' and isnull(pcqh,'')=@ysqh and pcmx=@ysmx and pcnd=@ysnd and pczh=@yszh and pcxh=@ysxh and zf_id<>@zf_id
                    union
                    select zf_id from zf_jbxx_fb where isnull(yaysqh,'')=@ysqh and yaysmx=@ysmx and yaysnd=@ysnd and yayszh=@yszh and yaysxh=@ysxh and zf_id<>@zf_id) a join zf_jbxx b on a.zf_id=b.zf_id
        end
      else
        --不返回队别，只返回同案犯姓名及状况
        select @jg=@jg+(case when @jg='' then '' else '、' end)+b.xm+
                   '('+dbo.get_zyxz(a.zf_id,@jzrq,b.zybz,'2',@dwbm)+')'
          from (select zf_id from zf_xfzb where bdlb='22' and isnull(pcqh,'')=@ysqh and pcmx=@ysmx and pcnd=@ysnd and pczh=@yszh and pcxh=@ysxh and zf_id<>@zf_id
                union
                select zf_id from zf_jbxx_fb where isnull(yaysqh,'')=@ysqh and yaysmx=@ysmx and yaysnd=@ysnd and yayszh=@yszh and yaysxh=@ysxh and zf_id<>@zf_id) a join zf_jbxx b on a.zf_id=b.zf_id
      
      set @jg=replace(@jg,'()','')
    end

  return @jg
end








GO
/****** Object:  UserDefinedFunction [dbo].[get_taf_table]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS OFF
GO
SET QUOTED_IDENTIFIER ON
GO


--返回同案犯表(所属模块：按姓名查询)
--select * from dbo.get_taf_table('0180980314704DFC93649B3048BAA414','5','4501')

CREATE function [dbo].[get_taf_table]
(
 @zf_id varchar(32),
 @dwjb varchar(2),   --用户单位级别
 @dwbm varchar(4)    --用户单位编码
)
returns @jg table(zf_bh varchar(11) ,xm varchar(50),zyxz varchar(50),gydw varchar(80),syzm varchar(250),xq varchar(50),qr varchar(10) ,zr varchar(10) ,jtzz varchar(180),nl varchar(4))
--WITH ENCRYPTION
as
begin
  declare @ysqh varchar(100),@ysmx varchar(100),@ysnd int,@yszh varchar(80),@ysxh varchar(80)
  select top 1 @ysqh=isnull(pcqh,''),@ysmx=pcmx,@ysnd=pcnd,@ysxh=pcxh from zf_xfzb where zf_id=@zf_id and bdlb='22'  --编码22为一审
  
  if @ysmx<>'' and @ysnd>0 and @yszh<>'' and @ysxh<>''
    begin
      insert into @jg(zf_bh ,xm ,zyxz ,gydw ,syzm ,xq ,qr ,zr ,jtzz ,nl)
        select a.zf_bh,      --罪犯编号
               a.xm as xm,   --姓名
               dbo.get_zyxz(a.zf_id,null,a.zybz,@dwbm) as zyxz,  --在押现状
               (case when @dwjb in ('1','3','4') then dbo.get_mc('1Z',a.gydw) else dbo.get_mc('1U',a.gyjq) end) as gydw, --关押
               isnull(a.syzm,'') as syzm,    --罪名
               dbo.get_mask_xq(b.xq,2,'') as xq,  --刑期
               isnull(b.qr,'') as qr,  --起日
               isnull(b.zr,'') as zr,  --止日
               dbo.get_qhmx(a.jtqh,a.jtmx) as jtzz, --家庭住址
               isnull(dbo.get_nl(a.csrq,null),'') as nl --年龄
        from zf_jbxx a
             join zf_xfzb b on a.zf_id=b.zf_id and flag='1'
             join (select zf_id from zf_xfzb where bdlb='22' and isnull(pcqh,'')=@ysqh and pcmx=@ysmx and pcnd=@ysnd and pczh=@yszh and pcxh=@ysxh
                   union
                   select zf_id from zf_jbxx_fb where isnull(yaysqh,'')=@ysqh and yaysmx=@ysmx and yaysnd=@ysnd and yayszh=@yszh and yaysxh=@ysxh) c on a.zf_id=c.zf_id
        where a.zf_id<>@zf_id
    end
 return 
end





GO
/****** Object:  UserDefinedFunction [dbo].[get_tbgz]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回用顿号分隔的特别关注串

/* 返回值参数(cs)
空/NULL 返回全部特别关注串
SD      返回涉毒、涉枪、涉黑、涉恶
LGF     返回累犯、惯犯
ZY/TG   返回重要罪犯/特管罪犯
LCLB    返回流窜类别
*/

--select dbo.get_tbgz(zf_id,'','') from zf_jbxx where zybz='1' and exists (select 1 from zf_tbgz where zf_id=zf_jbxx.zf_id)


CREATE function [dbo].[get_tbgz]
(
 @zf_id varchar(50),
 @cs varchar(10),    --返回值格式  空/NULL：返回全部特别关注   SD:返回涉毒、涉枪、涉黑、涉恶   LGF:返回累犯、惯犯   Z:返回重要罪犯类别
 @dwbm varchar(4)    --单位编码
)
returns varchar(100)
as
begin
	declare @jg varchar(200)
	set @jg=''
  
  if @cs='' or @cs is null
    --全部特别关注
    select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('2Z',tbgzlb)
      from zf_tbgz where zf_id=@zf_id and not (tbgzlb='' or tbgzlb is null) order by xh
  else if @cs='SD'
    --涉毒、涉枪、涉黑、涉恶
    select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('2Z',tbgzlb)
      from zf_tbgz where zf_id=@zf_id and tbgzlb in ('1','2','3','4') order by xh
  else if @cs='LGF'
    --累犯、惯犯
    select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('2Z',tbgzlb)
      from zf_tbgz where zf_id=@zf_id and tbgzlb in ('10','11') order by xh
  else if @cs like 'ZY%' or @cs like 'TG%'
    --重要罪犯/特管罪犯
    select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('2Z',a.tbgzlb)
      from zf_tbgz a join pub_dmb b on a.tbgzlb=b.bm and b.lb='2Z' 
      where zf_id=@zf_id and b.fjxx1='1' order by a.xh
  else if @cs='LCLB'
    --流窜类别
    select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('2Z',tbgzlb)
      from zf_tbgz where zf_id=@zf_id and tbgzlb in ('19','20','21') order by xh

	return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_today]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回当前日期

CREATE    FUNCTION [dbo].[get_today] 
(
	@flag int  --0：返回8位数字字符  1:返回XXXX年X月X日  2：返回XXXX.XX.XX
)
returns varchar(20)

as
begin
	declare @jg varchar(20)
	if @flag=0
		select @jg=convert(varchar(8),output,112) from vw_today
	else if @flag=1
		set @jg=dbo.get_mask_date((select output from vw_today),2,4) 
	else if @flag=2
		set @jg=dbo.get_mask_date((select output from vw_today),1,4) 
	return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_tz]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回特征串
--select top 100 dbo.get_tz(zf_id,'2') from zf_jbxx where zybz='1' and exists (select 1 from zf_tz where zf_id=zf_jbxx.zf_id)

CREATE  function [dbo].[get_tz]
(
 @zf_id varchar(50),
 @cs varchar(4)      --返回形式： 1所有特征（包括身高、体型、脸型、口音、皮肤标记、其它特征） 2仅返回其它特征
)
returns varchar(500)
as
begin
  declare @jg varchar(500),@pfbj varchar(2000),@tz varchar(200)
  set @jg=''
  set @tz=''
  
  if @cs='1'
    --返回所有特征
    begin
      select @jg=(case when sg>0 then '身高：'+left(cast(cast(sg as int) as varchar(4)),1)+'.'+substring(cast(cast(sg as int) as varchar(4)),2,3)+'米  ' else '' end)+
                  (case when tx<>'' then '体型：'+dbo.get_mc('2A',tx)+'  ' else '' end)+
                  (case when lx<>'' then '脸型：'+dbo.get_mc('2C',lx)+'  ' else '' end)+
                  (case when ky<>'' then '口音：'+ky+'  ' else '' end),
             @pfbj=isnull(pfbj,'')
        from zf_tz where zf_id=@zf_id

      select @tz=@tz+(case when @tz='' then '' else '、' end)+dbo.get_mc('2D',tz)
        from zf_tz_fb where zf_id=@zf_id and tz<>'' order by xh
      
      if @jg<>'' and @tz<>''
        set @jg=@jg+'其它特征：'+@tz+(case when @pfbj='' then '' else '，'+@pfbj end)
      else if @jg<>''
        set @jg=@jg+(case when @pfbj='' then '' else '  '+@pfbj end)
      else if @tz<>''
        set @jg=@tz+(case when @pfbj='' then '' else '，'+@pfbj end)
    end
  else
     --仅返回其它特征
    select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('2D',tz)
      from zf_tz_fb where zf_id=@zf_id and tz<>'' order by xh
   
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_wjf_yz]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回外国籍罪犯语种串

CREATE function [dbo].[get_wjf_yz]
(
 @zf_id varchar(50)
)
returns varchar(100)

as
begin
	declare @jg varchar(100)
	set @jg=''
  
  select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('10',yz)
    from zf_wjf_yz where zf_id=@zf_id and yz<>'' order by xh
  
	return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_wwzk]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回顽危重控信息
--select zf_id,dbo.get_wwzk(zf_id,null,'2','') from zf_jbxx where zybz='1' and exists (select 1 from zf_wwzk where zf_id=zf_jbxx.zf_id)

CREATE   function [dbo].[get_wwzk]
(
 @zf_id varchar(50),
 @jzrq datetime,    --截止日期(NULL表示当前日期)
 @cs varchar(2),    --返回形式：1返回顽危重控类别名称  2返回顽危性质名称
 @dwbm varchar(6)   --单位编码（用于用户特殊需求）
)
returns varchar(200)
as
begin
  declare @jg varchar(200)
  set @jg=''
  
  if @cs='1'
    --返回顽危重控类别
    begin
      if @jzrq is null
        select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('3T',zklb)
          from zf_wwzk where zf_id=@zf_id and cxrq is null order by pzrq
      else
        select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('3T',zklb)
          from zf_wwzk where zf_id=@zf_id and (pzrq<=@jzrq or pzrq is null) and (cxrq is null or cxrq>@jzrq) order by pzrq
    end
  else if @cs='2'
    --返回顽危重控性质
    begin
      if @jzrq is null
        select @jg=@jg+(case when @jg='' then '' else (case when zkxz1<>'' or zkxz2<>'' then '、' else '' end) end)+
                   (case when zkxz1<>'' and zkxz2<>'' then dbo.get_mc('2M',zkxz1)+'、'+dbo.get_mc('2M',zkxz2)
                         when zkxz1<>'' then dbo.get_mc('2M',zkxz1)
                         when zkxz2<>'' then dbo.get_mc('2M',zkxz2) else '' end)
          from zf_wwzk where zf_id=@zf_id and cxrq is null and (zkxz1<>'' or zkxz2<>'') order by pzrq
      else
        select @jg=@jg+(case when @jg='' then '' else (case when zkxz1<>'' or zkxz2<>'' then '、' else '' end) end)+
                   (case when zkxz1<>'' and zkxz2<>'' then dbo.get_mc('2M',zkxz1)+'、'+dbo.get_mc('2M',zkxz2)
                         when zkxz1<>'' then dbo.get_mc('2M',zkxz1)
                         when zkxz2<>'' then dbo.get_mc('2M',zkxz2) else '' end)
          from zf_wwzk where zf_id=@zf_id and (pzrq<=@jzrq or pzrq is null) and (cxrq is null or cxrq>@jzrq) and (zkxz1<>'' or zkxz2<>'') order by pzrq
    end
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_xaflb]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回截止日期时的现案犯类别
--select top 1000 dbo.get_xaflb(zf_id,'20121231','1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_xaflb]
(
 @zf_id varchar(50),
 @jzrq datetime,     --截止日期(传NULL 表示当前日期)
 @cs varchar(2)      --返回值参数 0：返回编码   1：返回名称
)
returns varchar(40)

as
begin
  declare @jg varchar(40)
  
  if @jzrq is null
    --读取最新现案犯类别
    select top 1 @jg=aflb from zf_xfzb where zf_id=@zf_id and flag='1'
  else
    --读取截止日期时的现案犯类别
    select top 1 @jg=aflb from zf_xfzb where zf_id=@zf_id and pcrq<=@jzrq and pcrq>=(select pcrq from zf_xfzb where zf_id=@zf_id and iszs='1') order by pcrq desc,cjsj desc
  
  if @jg is null
    return ''
  
  if @cs='2'
    set @jg=dbo.get_mc('2I',@jg)
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_xfbdqk]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO


--返回刑罚变动情况（用于条件检索输出）

/*  返回值形式参数说明
1  加减刑简况(日期、幅度)
2  刑罚变动简况（日期、类别、刑期）
3  刑罚变动情况（日期、类别、刑期、起止日）
H  每记录后加换行符号
C  日期为“2012年10月5日”的形式，否则为“2012.10.05”的形式
*/

--select top 1000 dbo.get_xfbdqk(zf_id,null,'1C','') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_xfbdqk]
(
 @zf_id varchar(50),
 @jzrqs datetime,   --截止日期（NULL表示当前日期）
 @cs varchar(4),    --返回形式参数
 @dwbm varchar(6)   --单位编码（用于用户特殊需求）
)
returns varchar(1000)
as
begin
  declare @jg varchar(1000),@cr varchar(2),@jzrq datetime,@zsrq datetime,@rqxs tinyint
  set @jg=''
  set @cr=(case when @cs like '%H%' then char(10) else '；' end)  --记录分隔符号
  set @rqxs=(case when @cs like '%C%' then 2 else 1 end)          --日期输出形式
  set @jzrq=(case when @jzrqs is null then '99991231' else @jzrqs end)
  --读取终审判决日期
  select @zsrq=pcrq from zf_xfzb where zf_id=@zf_id and iszs='1'
  
  if @cs like '1%'
    --加减刑简况
    select @jg=@jg+(case when @jg='' then '' else @cr end)+dbo.get_mask_date(a.pcrq,@rqxs,4)+
        (case when a.bdlb in ('7','8','10')  --狱内减刑/狱外减刑/减刑释放
                then (case when a.bdfd like '99%' or a.xq like '99%' then '减至'+dbo.get_mask_xq(a.xq,2,'')
                           else '减'+dbo.get_mask_xq(a.bdfd,2,'') end)
              when a.bdlb in ('4','5','6')   --狱内加刑/狱外加刑/余罪加刑
                then (case when a.bdlb='6' then '余罪' else '' end)+
                     (case when a.xq like '99%' then '加刑,刑期加至'+dbo.get_mask_xq(a.xq,2,'')
                           else '加刑'+dbo.get_mask_xq(a.bdfd,2,'') end)
              when a.bdlb='3'   --重新判决
                then '解回重新判决,刑期'+dbo.get_mask_xq(a.xq,2,'')
              when a.bdlb='18'  --撤销减刑  
                then '撤销'+(case when (select count(*) from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)>0
                                    then '前'+(select cast(count(*) as varchar(2)) from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)+'次' else '' end)+'减刑，刑期'+dbo.get_mask_xq(xq,2,'')
              when a.bdlb='16'  --处决
                then '处决'
        end)
      from zf_xfzb a where a.zf_id=@zf_id and a.pcrq>@zsrq and a.pcrq<=@jzrq and a.bdlb in ('3','4','5','6','7','8','10','16','18') order by a.pcrq,a.cjsj
  else if @cs like '2%'
    --刑罚变动简况
    select @jg=@jg+(case when @jg='' then '' else @cr end)+dbo.get_mask_date(a.pcrq,@rqxs,4)+replace(replace(dbo.get_mc('1Q',a.bdlb),'狱内',''),'狱外','')+
      (case when a.bdlb in ('7','8','10')  --狱内减刑/狱外减刑/减刑释放
              then (case when a.bdfd like '99%' or a.xq like '99%' then ',刑期减至'
                         else dbo.get_mask_xq(a.bdfd,2,'')+',刑期' end)+dbo.get_mask_xq(a.xq,2,'')
            when a.bdlb in ('4','5','6')   --狱内加刑/狱外加刑/余罪加刑
              then (case when a.xq like '99%' then ',刑期加至'
                         else dbo.get_mask_xq(a.bdfd,2,'')+',刑期' end)+dbo.get_mask_xq(a.xq,2,'')
            when a.bdlb='20'  --止日顺延
              then (case when a.bdfd='' or a.bdfd is null then '' else a.bdfd+'天' end)
            when a.bdlb='18'  --撤销减刑
              then '撤销'+(case when (select count(*) from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)>0
                                  then '前'+(select cast(count(*) as varchar(2)) from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)+'次' else '' end)+'减刑，刑期'+dbo.get_mask_xq(xq,2,'')
            when a.bdlb in ('11','12','14','15','16','19')  --赦免释放/免刑释放/无罪释放/假释/处决/免于刑事处罚
              then ''
            else ',刑期'+dbo.get_mask_xq(a.xq,2,'')
        end)
      from zf_xfzb a where a.zf_id=@zf_id and a.pcrq>@zsrq and a.pcrq<=@jzrq order by a.pcrq,a.cjsj
  else if @cs like '3%'
    --刑罚变动情况
    select @jg=@jg+(case when @jg='' then '' else @cr end)+dbo.get_mask_date(a.pcrq,@rqxs,4)+dbo.get_mc('1Q',a.bdlb)+
      (case when a.bdlb in ('7','8','10')  --狱内减刑/狱外减刑/减刑释放
              then (case when a.bdfd like '99%' or a.xq like '99%' then ',刑期减至'
                         else dbo.get_mask_xq(a.bdfd,2,'')+',刑期' end)+dbo.get_mask_xq(a.xq,2,'')+
                   (case when a.qr is null then '' else ' 起日'+dbo.get_mask_date(a.qr,@rqxs,4) end)+
                   (case when a.zr is null then '' else ' 止日'+dbo.get_mask_date(a.zr,@rqxs,4) end)
            when a.bdlb in ('4','5','6')   --狱内加刑/狱外加刑/余罪加刑
              then (case when a.xq like '99%' then ',刑期加至'
                         else dbo.get_mask_xq(a.bdfd,2,'')+',刑期' end)+dbo.get_mask_xq(a.xq,2,'')+
                   (case when a.qr is null then '' else ' 起日'+dbo.get_mask_date(a.qr,@rqxs,4) end)+
                   (case when a.zr is null then '' else ' 止日'+dbo.get_mask_date(a.zr,@rqxs,4) end)
            when a.bdlb='20'  --止日顺延
              then (case when a.bdfd='' or a.bdfd is null then '' else a.bdfd+'天' end)
            when a.bdlb='18'  --撤销减刑
              then '撤销'+(case when (select count(*) from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)>0
                                  then '前'+(select cast(count(*) as varchar(2)) from zf_xfzb_cxjx where zf_xfzb_oid=a.oid)+'次' else '' end)+'减刑，刑期'+dbo.get_mask_xq(xq,2,'')
            when a.bdlb in ('11','12','14','15','16','19')  --赦免释放/免刑释放/无罪释放/假释/处决/免于刑事处罚
              then ''
            else ',刑期'+dbo.get_mask_xq(a.xq,2,'')+
                   (case when a.qr is null then '' else ' 起日'+dbo.get_mask_date(a.qr,@rqxs,4) end)+
                   (case when a.zr is null then '' else ' 止日'+dbo.get_mask_date(a.zr,@rqxs,4) end)
        end)
      from zf_xfzb a where a.zf_id=@zf_id and a.pcrq>@zsrq and a.pcrq<=@jzrq order by a.pcrq,a.cjsj
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_xq]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回刑期
--select top 1000 dbo.get_xq(zf_id,'20121231','1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_xq]
(
 @zf_id varchar(50),
 @jzrq datetime,    --截止日期(传NULL 表示当前日期)
 @cs varchar(2)     --返回值格式参数  空或0：返回字段值(编码)   1：返回yy_mm_dd/无期/死缓   2：返回yy年m个月d天/无期/死缓
)
returns varchar(20)
as
begin
  declare @jg varchar(20)
  set @jg=''
  
  if @jzrq is null
    --读取最新刑期
    select top 1 @jg=xq from zf_xfzb where zf_id=@zf_id and flag='1'
  else
    --读取截止日期前的刑期
    select top 1 @jg=xq from zf_xfzb where zf_id=@zf_id and pcrq<=@jzrq and pcrq>=(select pcrq from zf_xfzb where zf_id=@zf_id and iszs='1' ) order by pcrq desc,cjsj desc
  if @cs in ('1','2')
    begin
      if @jg like '99%'
        set @jg=(case @jg when '9995' then '无期'
                          when '9996' then '死缓'
                          when '9990' then '有期'
                          when '9997' then '死刑'
                          else '' end)
      else
        begin
          if @cs='1'
            --返回值形式：10_06_03
            set @jg=left(@jg,2)+'_'+substring(@jg,3,2)+'_'+substring(@jg,5,2)
          else
            --返回值形式：10年6个月3天
            set @jg=(case when @jg like '00%' then '' else cast(cast(left(@jg,2) as int) as varchar(2))+'年' end)+
                    (case when @jg like '__00%' then '' else cast(cast(substring(@jg,3,2) as int) as varchar(2))+'个月' end)+
                    (case when @jg like '____00' then '' else cast(cast(substring(@jg,5,2) as int) as varchar(2))+'天' end)
        end
    end
    
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_xscy]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--按截止日期返回“新收/常押”编码

CREATE function [dbo].[get_xscy]
(
 @zf_id varchar(50),
 @jzrq datetime,    --截止日期(传NULL 表示当前日期)
 @cs varchar(1)     --返回值参数  0：返回字段值（编码）  1：返回名称
)
returns varchar(40)
as
begin
  declare @jg varchar(40)

  if @jzrq is null
    select @jg=xscy from zf_xscy where zf_id=@zf_id and flag='1'
  else
    select top 1 @jg=xscy from zf_xscy where zf_id=@zf_id and (bdrq<=@jzrq or bdrq is null) order by bdrq desc,cjsj desc

  if @jg is null
    return ''
  if @cs='1'
    set @jg=dbo.get_mc('23',@jg)
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_xz]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回刑种

CREATE function [dbo].[get_xz]
(
 @xq varchar(6)  --刑期串，格式：100603
)
returns varchar(40)

as
begin
  if isnumeric(@xq)=0 or @xq is null
    return ''
  if cast(@xq as int)=0
    return ''

  declare @jg varchar(40)
  if @xq='9996'
    set @jg='死刑,缓期二年执行'
  else if @xq='9995'
    set @jg='无期徒刑'
  else
    set @jg='有期徒刑'
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_xzjx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--限制减刑函数  返回值为编码或汉字名称

/* 返回值形式(@cs)
1  返回编码：0:不限制减刑  1:限制减刑   11:刑期不少于20年  12:刑期不少于25年  21:刑期不少于13年（无期） 22:刑期不少于15年（死缓） 
1N 返回编码 不考虑不限制减刑的无期(21)和死缓(22)
2  返回名称（不限制减刑的返回空串）
3  返回名称（不限制减刑返回“不限制减刑”)
*/

--select top 1000 zf_bh,xm,dbo.get_xzjx(zf_id,null,'2','') from zf_jbxx where zybz='1'

CREATE  function [dbo].[get_xzjx]
(
 @zf_id varchar(50),
 @jzrqs datetime,   --截止日期（NULL为当前日期）
 @cs varchar(2),    --返回值形式  1：编码   2：汉字名称  3：汉字名称  
 @dwbm varchar(4)   --用户单位编码（用于用户特殊需求）
)
returns varchar(40)

as
begin  
	declare @jg varchar(40),@pjrq datetime,@xq varchar(6),@jzrq datetime,@xzjx tinyint

  if @jzrqs is null
    --无截止日期
    begin
      set @jzrq='99991231'
      --读取“是否限制减刑”
      select top 1 @xzjx=xzjx from zf_xfzb where zf_id=@zf_id and flag='1'
    end
  else
    --有截止日期
    begin
      set @jzrq=@jzrqs
      --读取截止日期时“是否限制减刑”
      select top 1 @xzjx=a.xzjx
        from zf_xfzb a
        where a.zf_id=@zf_id and a.pcrq<=@jzrq and pcrq>=(select pcrq from zf_xfzb where zf_id=@zf_id and iszs='1')
        order by pcrq desc,cjsj desc
    end
  
  if @xzjx=1
    --该罪犯“限制减刑”
    begin
      set @jg=(case when @cs like '1%' then '1' else '限制减刑' end)
      set @xq=''
      
      --读取截止日期前最后一个刑期为死缓记录的判决日期
      select top 1 @pjrq=pcrq
        from zf_xfzb
        where zf_id=@zf_id and pcrq<=@jzrq and xq='9996' and xzjx=1 order by pcrq desc
      if isdate(@pjrq)=1
        begin
          --读取死缓记录之后的第一个减刑记录的刑期
          select top 1 @xq=xq from zf_xfzb where zf_id=@zf_id and pcrq>@pjrq and pcrq<=@jzrq and bdlb in ('7','8') order by pcrq
          if @xq='9995'
            --减为无期
            set @jg=(case when @cs like '1%' then '12' else '刑期不少于25年' end)
          else if @xq<'99' and not (@xq='' or @xq is null)
            --减为有期
            set @jg=(case when @cs like '1%' then '11' else '刑期不少于20年' end)
        end
    end
  else if @cs<>'1N'
    begin
      --不限制减刑的，判断是否有死缓记录
      set @xq=''
      select top 1 @xq=xq,@pjrq=pcrq
        from zf_xfzb
        where zf_id=@zf_id and xq='9996' and pcrq<=@jzrq and pcrq>=(select pcrq from zf_xfzb where zf_id=@zf_id and iszs='1')
        order by pcrq desc
      if @xq='9996'
         begin
           --有死缓记录
           set @jg=(case when @cs='1' then '22' else '刑期不少于15年(死缓)' end)  --死缓的初始值
           
           --判断死缓之后是否有改判记录
           set @xq=''
           select top 1 @xq=xq from zf_xfzb where zf_id=@zf_id and pcrq>@pjrq and pcrq<=@jzrq and bdlb='2' and xq<>'' order by pcrq desc
           if @xq='9995'
             --改判后刑期为无期
             set @jg=(case when @cs='1' then '21' else '刑期不少于13年(无期)' end)
           else if @xq<'99' and @xq<>''
             --改判后为有期徒刑
             set @jg=(case when @cs='1' then '0' when @cs='2' then '' else '不限制减刑' end)
         end
      else
        begin
          --不限制减刑且无死缓记录的，判断是否有无期记录
          set @xq=''
          select top 1 @xq=xq,@pjrq=pcrq
            from zf_xfzb
            where zf_id=@zf_id and xq='9995' and pcrq<=@jzrq and pcrq>=(select pcrq from zf_xfzb where zf_id=@zf_id and iszs='1')
            order by pcrq desc
          if @xq='9995'
            begin
              --有无期记录
              set @jg=(case when @cs='1' then '21' else '刑期不少于13年(无期)' end)  --无期的初始值
              --判断无期之后是否有改判为有期徒刑的记录
              if exists (select top 1 1 from zf_xfzb where zf_id=@zf_id and pcrq>@pjrq and pcrq<=@jzrq and bdlb='2' and xq<'99' and xq<>'' order by pcrq desc)
                --有改判为有期徒刑的记录
                set @jg=(case when @cs='1' then '0' when @cs='2' then '' else '不限制减刑' end)
            end
        end
    end
  if @jg is null
    set @jg=(case when @cs like '1%' then '0' when @cs='2' then '' else '不限制减刑' end)
  
	return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_yfxq]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--函数功能：返回已服刑期 (有错误数据无法计算的，返回NULL)
--select top 1000 dbo.get_yfxq(zf_id,null,1,3,3,'T') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_yfxq]
(
 @zf_id varchar(50),
 @jzrqs datetime,     --截止日期（NULL表示当前日期）
 @qslx_yq tinyint,    --原判有期徒刑起算日期类型(1原判起日  2羁押日期  3终审判决日期)
 @qslx_wq tinyint,    --原判无期起算日期类型    (1原判起日  2羁押日期  3终审判决日期  4执行通知书下达日期)
 @qslx_sh tinyint,    --原判死缓起算日期类型    (1原判起日  2羁押日期  3终审判决日期  4执行通知书下达日期)
 @cs varchar(2)       --返回值形式参数  0或空：返回6位字符串“050600”  1：返回“05_06_00”   2：返回“5年6个月”  T:返回天数串
)
returns varchar(20)
as
begin
  declare @jg varchar(20),
          @jyrq varchar(8), --羁押日期
          @dbrq  datetime,  --逮捕日期
          @ypxq varchar(6), --原判刑期
          @pjrq  datetime,  --终审判决日期
          @ypqr  datetime,  --原判起日
          @zxrq  datetime,  --执行通知书下达日期
          @gp_qr datetime,  --改判起日（刑罚变动中“改判”或“裁定”记录的起日）
          @qslx  tinyint,   --起算类型
          @qsrq  datetime,  --起算日期
          @rq_1  datetime,  --临时变量
          @rq_2  datetime,  --临时变量
          @day   int,       --止日顺延天数+监外执行脱管天数+假释收监的假释期间的天数+脱逃天数
          @ljlb varchar(5), --离监类别
          @ljrq datetime,   --离监日期
          @zybz char(1),    --在押标志
          @jzrq datetime,   --截止日期
          @sjbm varchar(6), --上级编码
          @oid varchar(50)
  
  --读取 羁押日期、逮捕日期，原判刑期、原判起日、原判决日期、执行通知书下达日期、在押标志
  select @jyrq=a.jyrq,@dbrq=a.dbrq,@ypxq=b.xq,@ypqr=b.qr,@pjrq=b.pcrq,@zxrq=b.zxrq,@zybz=a.zybz
    from zf_jbxx a left join zf_xfzb b on a.zf_id=b.zf_id and b.bdlb='1' where a.zf_id=@zf_id

  if @jzrqs is null
    begin
      --截止日期为当日日期
      select @jzrq=output from vw_today
      if @zybz='3'
        --读取离监类别、离监日期
        select top 1 @ljlb=a.ljlb,@ljrq=a.ljrq,@sjbm=b.sjbm
          from zf_crj a left join pub_dmb b on a.ljlb=b.bm and b.lb='1P' where a.zf_id=@zf_id and a.GYDW_FLAG='1'
    end
  else
    begin
      --截止日期为参数传入的日期
      set @jzrq=@jzrqs
      --判断截止日期时是否在押,同时读取离监类别、离监日期
      select top 1 @zybz=(case when a.ljrq is null or a.ljrq>@jzrq then '1' else '3' end),@ljlb=a.ljlb,@ljrq=a.ljrq,@sjbm=b.sjbm
        from zf_crj a left join pub_dmb b on a.ljlb=b.bm and b.lb='1P'
        where zf_id=@zf_id and (a.syrq<=@jzrq or a.syrq is null) order by a.syrq desc,a.cjsj desc
    end
    
  if @zybz<>'1' --已离监
    begin
      if (@ljlb in ('2','3','4') or @sjbm in ('2','3','4')) and not exists (select 1 from zf_xfzb where zf_id=@zf_id and pcrq<=@jzrq and (left(xq,2)='99' or bdlb in ('4','5','6','15')))
        begin
          --刑满释放、减刑释放、改判释放，且没有无期、死缓、加刑、假释记录，取最后的刑期作为“已服刑期”
          select @jg=isnull(xq,'') from zf_xfzb where zf_id=@zf_id and flag='1'
          return @jg
        end
      set @jzrq=@ljrq  --已离监罪犯已服刑期的截止日期为离监日期
    end
  
  --根据原判刑期判断起算类型
  set @qslx=(case when @ypxq='9995' then @qslx_wq when @ypxq='9996' then @qslx_sh else @qslx_yq end)
  
  --将“改判”、“裁定”记录的起日存入变量
  set @gp_qr=(select min(qr) from zf_xfzb where zf_id=@zf_id and (pcrq<=@jzrq or pcrq is null) and bdlb in ('2','3','13','99') and qr is not null)  --2改判  3重新判决 13改判释放  99其它裁定

  --若改判起日小于原判起日，将原判起日调整为改判起日
  if @gp_qr<@ypqr
     set @ypqr=@gp_qr
  
  --确定已服刑期的起算日
  if @qslx=2  --起算类型为“羁押日期”
    set @qsrq=(case when @jyrq is not null then @jyrq  --羁押日期
                    when @ypqr is not null then @ypqr  --原判起日
                    when @dbrq is not null then @dbrq  --逮捕日期
                    when @pjrq is not null then @pjrq  --判决日期
                    else @zxrq end)                    --下达日期
  else if @qslx=3  --起算类型为“判决日期”
    set @qsrq=(case when @pjrq is not null then @pjrq  --判决日期
                    when @ypqr is not null then @ypqr  --原判起日
                    when @jyrq is not null then @jyrq  --羁押日期
                    when @dbrq is not null then @dbrq  --逮捕日期
                    else @zxrq end)                    --下达日期
  else if @qslx=4  --起算类型为“执行通知书下达日期”
    set @qsrq=(case when @zxrq is not null then @zxrq  --下达日期
                    when @pjrq is not null then @pjrq  --判决日期
                    when @ypqr is not null then @ypqr  --原判起日
                    when @jyrq is not null then @jyrq  --羁押日期
                    else @dbrq end)                    --逮捕日期
  else   --@qslx=1 起算类型为“原判起日”
    set @qsrq=(case when @ypqr is not null then @ypqr  --原判起日
                    when @jyrq is not null then @jyrq  --羁押日期
                    when @dbrq is not null then @dbrq  --逮捕日期
                    when @pjrq is not null then @pjrq  --判决日期
                    else @zxrq end)                    --下达日期
  
  if @qsrq is null or @jzrq is null or @jzrq<=@qsrq
    --起算日期空/截止日期空/截止日期<=起算日期，无法计算已服刑期，返回NULL
    return null
  
  set @day=0
  
  --检查是否有“止日顺延”记录
  select @rq_1=max(zxrq) from zf_xfzb where zf_id=@zf_id and (zxrq<=@jzrq or zxrq is null) and bdlb='20'
  if isdate(@rq_1)=1
    --有“止日顺延”记录，计算顺延天数
    select @day=@day+cast(bdfd as int) from zf_xfzb where zf_id=@zf_id and (zxrq<=@jzrq or zxrq is null) and bdlb='20' and isnumeric(bdfd)=1
  else
    --无“止日顺延”记录
    set @rq_1='19500101'
  
  --判断“止日顺延”之后是否有监外执行脱管记录
  while exists (select 1 from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zf_id=@zf_id and b.tgqr>@rq_1 and b.tgqr<=@jzrq)
    begin
      --遍历各次监外执行脱管起日、止日
      select top 1 @rq_1=b.tgqr,@rq_2=b.tgzr,@oid=a.oid from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zf_id=@zf_id and b.tgqr>@rq_1 and b.tgqr<=@jzrq order by b.tgqr
      if isdate(@rq_2)=1 and @rq_2>@rq_1
        --有脱管起止日，计算脱管天数
        set @day=@day+datediff(dd,@rq_1,@rq_2)
      else if isdate(@rq_1)=1 and isdate(@rq_2)=0
        --有脱管起日，无脱管止日,判断是否已收监，若已收监，将收监日期作为脱管止日
        begin
          set @rq_2=(select top 1 zzrq from zf_jwzx where oid=@oid and zzrq>@rq_1 and zzrq<=@jzrq order by zzrq)
          if isdate(@rq_2)=1
            --有收审或收监日期，累加脱管天数
            set @day=@day+datediff(dd,@rq_1,@rq_2)
          else
            begin
              --未收监，将脱管起日-1作为计算已服刑期的截止日期
              set @jzrq=dateadd(dd,-1,@rq_1)
              break
            end
        end
    end
    
  --检查是否有“假释收监”情况,若有，计算假释期间的天数（按假释期间不计入已服刑期计算）
  set @rq_1='19500101'
  set @rq_2=null
  while exists (select 1 from zf_crj where zf_id=@zf_id and ljrq>@rq_1 and ljrq<=@jzrq and ljlb='15')
    begin
      --读取假释离监日期
      select @rq_1=min(ljrq) from zf_crj where zf_id=@zf_id and ljrq>@rq_1 and ljrq<=@jzrq and ljlb='15'
      --读取假释收监日期
      select @rq_2=min(syrq) from zf_crj where zf_id=@zf_id and syrq>@rq_1 and syrq<=@jzrq and sylb='3'
      if isdate(@rq_1)=1 and isdate(@rq_2)=1 and @rq_2>@rq_1
        --有收监日期，计算假释天数
        set @day=@day+datediff(dd,@rq_1,@rq_2)
    end
  
  --检查是否有“脱逃记录”记录,若有，计算在逃天数
  if exists (select 1 from zc_tt where zf_id=@zf_id and ttrq<=@jzrq)
    begin
      select @day=@day+datediff(dd,ttrq,bhrq) from zc_tt where zf_id=@zf_id and ttrq<=@jzrq and bhrq>ttrq and bhrq<=@jzrq
      --检查是否有尚未捕回记录，若有，将脱逃日期-1作为计算已服刑期的截止日期
      set @rq_1=(select top 1 ttrq from zc_tt where zf_id=@zf_id and ttrq<=@jzrq and bhrq is null order by ttrq)
      if isdate(@rq_1)=1
        set @jzrq=dateadd(dd,-1,@rq_1)
    end
  
  if @jzrq<=@qsrq
    return null
  
  if @day>0
    --起算日期后延
    set @qsrq=@qsrq+@day

  if @cs='T'
    --计算天数，生成天数串
    return cast(datediff(day,@qsrq,@jzrq) as varchar(20))
  else
    --计算时间间隔，生成已服刑期字串(格式：120100)
    set @jg=dbo.get_sjjg(@qsrq,@jzrq)
  
  if @cs='1'
    set @jg=dbo.get_mask_xq(@jg,1,'')
  else if @cs='2'
    set @jg=dbo.get_mask_xq(@jg,2,'')

  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_yfxqbl]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--返回已服原判刑期比例/已服现刑期比例

/* 返回值形式参数
1 计算已服原判刑期比例 格式：0.45 (原判无期/死缓的返回NULL)（若有改判，原判刑期以改判为准）
2 计算已服原判刑期比例 格式：0.45 (原判无期/死缓的返回NULL)（不考虑改判）
3 计算已服现刑期比例 格式：0.45   (现无期/死缓的返回NULL)
*/

--select top 1000 dbo.get_yfxqbl(a.zf_id,null,a.zybz,'3','') from zf_jbxx a where a.zybz='1' and not exists (select 1 from zf_xfzb where zf_id=a.zf_id and xq like '99%')

CREATE  function [dbo].[get_yfxqbl]
(
 @zf_id varchar(50),
 @jzrqs datetime,   --截止日期（NULL表示当前日期）
 @zybz char(1),     --ZF_JBXX表在押标志
 @cs varchar(2),    --返回值形式参数
 @dwbm varchar(6)   --单位编码（用于用户特殊需求）
)
returns decimal(4,2)
as
begin
  declare @jg decimal(4,2),
          @xq varchar(6),   --原判刑期/现刑期
          @qr  datetime,    --原判起日/现起日
          @zr  datetime,    --原判止日/现止日
          @rq_1  datetime,  --临时变量
          @rq_2  datetime,  --临时变量
          @day   int,       --止日顺延天数+监外执行脱管天数+假释收监的假释期间的天数+脱逃天数
          @ljlb varchar(5), --离监类别
          @ljrq datetime,   --离监日期
          @jzrq datetime,   --截止日期
          @sjbm varchar(6), --上级编码
          @oid char(32)
  
  if @jzrqs is null
    begin
      --截止日期为当日日期
      select @jzrq=output from vw_today
      if @zybz='3'
        --读取离监类别、离监日期
        select top 1 @ljlb=a.ljlb,@ljrq=a.ljrq,@sjbm=b.sjbm
          from zf_crj a left join pub_dmb b on a.ljlb=b.bm and b.lb='1P' where a.zf_id=@zf_id and a.GYDW_FLAG='1'
    end
  else
    begin
      --截止日期为参数传入的日期
      set @jzrq=@jzrqs
      --判断截止日期时是否在押,同时读取离监类别、离监日期
      select top 1 @zybz=(case when a.ljrq is null or a.ljrq>@jzrq then '1' else '3' end),@ljlb=a.ljlb,@ljrq=a.ljrq,@sjbm=b.sjbm
        from zf_crj a left join pub_dmb b on a.ljlb=b.bm and b.lb='1P' where zf_id=@zf_id and (a.syrq<=@jzrq or a.syrq is null) order by a.syrq desc,a.cjsj desc
    end
    
  if @zybz<>'1' --已离监
    begin
      if (@ljlb in ('2','3','4') or @sjbm in ('2','3','4')) and not exists (select 1 from zf_xfzb where zf_id=@zf_id and pcrq<=@jzrq and (left(xq,2)='99' or bdlb in ('4','5','6','15')))
        --刑满释放、减刑释放、改判释放，且没有无期、死缓、加刑、假释记录，返回1.00
        begin
          return 1.00
        end
      set @jzrq=@ljrq  --已离监罪犯已服刑期的截止日期为离监日期
    end
  
  if @cs in ('1','2')
    --读取 原判刑期、原判起日、原判止日
    begin
      select top 1 @xq=xq,@qr=qr,@zr=zr from zf_xfzb where zf_id=@zf_id and bdlb='1'
      if @cs='1'
        --若有改判记录，以改判记录的刑期、起止日为准
       select top 1 @xq=xq,@qr=qr,@zr=zr from zf_xfzb where zf_id=@zf_id and (pcrq<=@jzrq or pcrq is null) and bdlb='2' order by pcrq desc,cjsj desc
    end
  else
    --读取现刑期、现起日、现止日
    select top 1 @xq=xq,@qr=qr,@zr=zr from zf_xfzb where zf_id=@zf_id and (pcrq<=@jzrq or pcrq is null) order by pcrq desc,cjsj desc
  
  if @xq like '99%' or @qr is null or @zr is null or @zr<=@qr
    return null

  set @day=0
  
  --检查是否有“止日顺延”记录
  select @rq_1=max(zxrq) from zf_xfzb where zf_id=@zf_id and zxrq<=@jzrq and bdlb='20'
  if isdate(@rq_1)=1
    --有“止日顺延”记录，计算顺延天数
    select @day=@day+cast(bdfd as int) from zf_xfzb where zf_id=@zf_id and (zxrq<=@jzrq or zxrq is null) and bdlb='20' and isnumeric(bdfd)=1
  else
    --无“止日顺延”记录
    set @rq_1='19500101'
  
  --判断“止日顺延”之后是否有监外执行脱管记录
  while exists (select 1 from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zf_id=@zf_id and b.tgqr>@rq_1 and b.tgqr<=@jzrq)
    begin
      --遍历各次监外执行脱管起日、止日
      select top 1 @rq_1=b.tgqr,@rq_2=b.tgzr,@oid=a.oid from zf_jwzx a join zf_jwzx_tg b on a.oid=b.zf_jwzx_oid where a.zf_id=@zf_id and b.tgqr>@rq_1 and b.tgqr<=@jzrq order by b.tgqr
      if isdate(@rq_2)=1 and @rq_2>@rq_1
        --有脱管起止日，计算脱管天数
        set @day=@day+datediff(dd,@rq_1,@rq_2)
      else if isdate(@rq_1)=1 and isdate(@rq_2)=0
        begin
          --有脱管起日，无脱管止日，判断是否已收监，若已收监，将收监日期作为脱管止日
          set @rq_2=(select top 1 zzrq from zf_jwzx where oid=@oid and zzrq>@rq_1 and zzrq<=@jzrq order by zzrq)
          if isdate(@rq_2)=1
            --有收监日期，累加脱管天数
            set @day=@day+datediff(dd,@rq_1,@rq_2)
          else
            begin
              --未收监，将脱管起日-1作为计算已服刑期的截止日期
              set @jzrq=dateadd(dd,-1,@rq_1)
              break
            end
        end
    end
    
  --检查是否有“假释收监”情况,若有，计算假释期间的天数（按假释期间不计入已服刑期计算）
  set @rq_1='19500101'
  set @rq_2=null
  while exists (select 1 from zf_crj where zf_id=@zf_id and ljrq>@rq_1 and ljrq<=@jzrq and ljlb='15')
    begin
      --读取假释离监日期
      select @rq_1=min(ljrq) from zf_crj where zf_id=@zf_id and ljrq>@rq_1 and ljrq<=@jzrq and ljlb='15'
      --读取假释收监日期
      select @rq_2=min(syrq) from zf_crj where zf_id=@zf_id and syrq>@rq_1 and syrq<=@jzrq and sylb='3'
      if isdate(@rq_1)=1 and isdate(@rq_2)=1 and @rq_2>@rq_1
        --有收监日期，计算假释天数
        set @day=@day+datediff(dd,@rq_1,@rq_2)
    end
  
  --检查是否有“脱逃记录”记录,若有，计算在逃天数
  if exists (select 1 from zc_tt where zf_id=@zf_id and ttrq<=@jzrq)
    begin
      select @day=@day+datediff(dd,ttrq,bhrq) from zc_tt where zf_id=@zf_id and ttrq<=@jzrq and bhrq>ttrq and bhrq<=@jzrq
      --检查是否有尚未捕回记录，若有，将脱逃日期-1作为计算已服刑期的截止日期
      set @rq_1=(select top 1 ttrq from zc_tt where zf_id=@zf_id and ttrq<=@jzrq and bhrq is null order by ttrq)
      if isdate(@rq_1)=1
        set @jzrq=dateadd(dd,-1,@rq_1)
    end
  
  if @day>0
    --截止日期前推
    set @jzrq=@jzrq-@day
  
  if @jzrq<=@qr
    --有错误数据，如：脱逃日期<原判起日
    return null

  --计算已服刑期比例(已服天数/刑期起止日之间的天数)
  set @jg=cast(datediff(day,@qr,@jzrq) as decimal(8,2))/cast(datediff(day,@qr,@zr) as decimal(8,2))
  if @jg>1
    set @jg=1.00
    
  return @jg
end






GO
/****** Object:  UserDefinedFunction [dbo].[get_ypbznx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回原判剥政年限
--select top 1000 dbo.get_bznx(zf_id,'1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_ypbznx]
(
 @zf_id varchar(50),
 @cs varchar(2)     --返回值格式  0或空：返回字段值   1：返回yy_mm_dd   2：返回yy年m个月d天
)
returns varchar(20)

as
begin
  declare @jg varchar(20)
  
  select top 1 @jg=bznx from zf_xfzb where zf_id=@zf_id and iszs='1'
  
  if @jg is null or isnumeric(@jg)=0
    return ''
  if cast(@jg as int)=0
    return ''
  
  if @jg='99'
    set @jg='终身'
  else
    begin
      if @cs='1'
        --返回值形式：10_06_03
        set @jg=left(@jg,2)+'_'+substring(@jg,3,2)+'_'+substring(@jg,5,2)
      else
        --返回值形式：10年6个月3天
        set @jg=(case when @jg like '00%' then '' else cast(cast(left(@jg,2) as int) as varchar(2))+'年' end)+
                (case when @jg like '__00%' then '' else cast(cast(substring(@jg,3,2) as int) as varchar(2))+'个月' end)+
                (case when @jg like '____00' then '' else cast(cast(substring(@jg,5,2) as int) as varchar(2))+'天' end)
    end
    
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_ypfj]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回原判罚金 (原判无罚金的返回0)
--select top 1000 dbo.get_ypfj(zf_id) from zf_jbxx where zybz='1'

CREATE function [dbo].[get_ypfj]
(
 @zf_id varchar(50)  --罪犯ID
)
returns decimal(14,2)
as
begin
  declare @jg decimal(14,2)
  
  select top 1 @jg=b.fjje from zf_xfzb a join zf_xfzb_fb b on a.oid=b.zf_xfzb_oid where a.zf_id=@zf_id and a.iszs='1'
  
  return isnull(@jg,0)
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_ypqr]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回原判起日
--select top 1000 dbo.get_ypxq(zf_id,'1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_ypqr]
(
 @zf_id varchar(50),
 @cs varchar(2)     --返回值格式  0：返回日期字符串20050908   1：返回2005.09.08   2：返回2005年9月8日
)
returns varchar(20)
as
begin
  declare @jg varchar(20)
  
  select top 1 @jg=convert(varchar(8),qr,112) from zf_xfzb where zf_id=@zf_id and iszs='1'
  if @jg is null
    return ''
  else if @cs ='1'
    set @jg=stuff(stuff(@jg,5,0,'.'),8,0,'.')
  else if @cs='2'
    set @jg=left(@jg,4)+'年'+cast(cast(substring(@jg,5,2) as int) as varchar(2))+'月'+cast(cast(substring(@jg,7,2) as int) as varchar(2))+'日'
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_ypxq]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--返回原判刑期
--select top 1000 dbo.get_ypxq(zf_id,'1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_ypxq]
(
 @zf_id varchar(50),
 @cs varchar(2)     --返回值格式  0：返回字段值(编码)   1：返回yy_mm_dd、无期、死缓   2：返回yy年m个月d天、无期、死缓
)
returns varchar(20)
as
begin
  declare @jg varchar(20)
  
  select top 1 @jg=xq from zf_xfzb where zf_id=@zf_id and iszs='1'
  if @jg is null
    set @jg=''
  else if @cs in ('1','2')
    begin
      if @jg like '99%'
        set @jg=(case @jg when '9995' then '无期'
                          when '9996' then '死缓'
                          when '9990' then '有期'
                          when '9997' then '死刑'
                          else '' end)
      else
        begin
          if @cs='1'
            --返回值形式：10_06_03
            set @jg=left(@jg,2)+'_'+substring(@jg,3,2)+'_'+substring(@jg,5,2)
          else
            --返回值形式：10年6个月3天
            set @jg=(case when @jg like '00%' then '' else cast(cast(left(@jg,2) as int) as varchar(2))+'年' end)+
                    (case when @jg like '__00%' then '' else cast(cast(substring(@jg,3,2) as int) as varchar(2))+'个月' end)+
                    (case when @jg like '____00' then '' else cast(cast(substring(@jg,5,2) as int) as varchar(2))+'天' end)
        end
    end

  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_ypxx]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回原判（终审判决）其他相关信息
--select top 1000 dbo.get_ypxx(zf_id,'2','1') from zf_jbxx where zybz='1' 

CREATE function [dbo].[get_ypxx]
(
 @zf_id varchar(50),
 @cs1 varchar(2),   --返回值参数 1没收财产  2限制减刑  3不得假释  4判决字号  5执行通知书下达日期  6驱逐出境  
 @cs2 varchar(2)     --返回值参数 1：逻辑值返回0/1、日期返回8位字符   2：逻辑值0返回空，逻辑值1返回名称(如：限制减刑/不得假释/驱逐出境)、日期返回2013.01.01   附加参数 C:日期返回2013年1有1日
)
returns varchar(100)
as
begin
  declare @jg varchar(100)
  
  if @cs1='1'
    --原判没收财产
    select top 1 @jg=mscc from zf_xfzb a join zf_xfzb_fb b on a.zf_id=b.zf_xfzb_oid where a.zf_id=@zf_id and a.iszs='1'
  else if @cs1 in ('4','5')
    select top 1 @jg=(case when @cs1='4' then dbo.get_zh(pcnd,pczh,pcxh)   --判决字号
                           else dbo.get_mask_date(zxrq,(case when @cs2 like '%C%' then 2 else 1 end),4) end) --执行通知书下达日期
      from zf_xfzb where zf_id=@zf_id and iszs='1'
  else
    select top 1 @jg=(case when @cs1='2' then (case when @cs2 like '%1%' then xzjx else (case when xzjx=1 then '限制减刑' else '' end) end)  --限制减刑
                           when @cs1='3' then (case when @cs2 like '%1%' then byxjs else (case when byxjs=1 then '不得假释' else '' end) end)  --不得假释
                           when @cs1='6' then (case when @cs2 like '%1%' then qzcj else (case when qzcj=1 then '驱逐出境' else '' end) end) --驱逐出境
                      else '' end)
      from zf_xfzb where zf_id=@zf_id and iszs='1'

  if @jg is null
    set @jg=''

  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_ypzmbm]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回原判第一罪名或原判所有罪名的编码
--select top 1000 dbo.get_ypzmbm(zf_id,'2') from zf_jbxx where zybz='1'

CREATE    function [dbo].[get_ypzmbm]
(
 @zf_id varchar(50),
 @cs varchar(2)    --1:返回原判第一罪名分类编码  2:返回原判所有罪名分类编码（逗号分隔）
)
returns varchar(200)
as
begin
  declare @jg varchar(200)
  
  if @cs='1'
    --返回原判第一罪名编码
    select top 1 @jg=zmfl
      from zf_zm
      where zf_id=@zf_id and zmxh=1 and pjrq=(select min(pjrq) from zf_zm where zf_id=@zf_id and zmxh=1)
  else
    --返回原判所有罪名编码或
    begin
      set @jg=''
      select @jg=@jg+(case when @jg='' then '' else ',' end)+zmfl
        from zf_zm
        where zf_id=@zf_id and zmfl<>'' and pjrq=(select min(pjrq) from zf_zm where zf_id=@zf_id and zmxh=1)
    end
  
  if @jg is null
    set @jg=''
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_ypzmmc]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回原判第一罪名名称或原判所有罪名名称
--select top 1000 dbo.get_ypzmmc(zf_id,'1X') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_ypzmmc]
(
 @zf_id varchar(50),
 @cs varchar(2)    --返回形式参数 1:返回原判第一罪名名称  2:返回原判所有罪名名称（顿号分隔）   附加参数 X:每个罪名后有刑期：如“盗窃(5年)”
)
returns varchar(200)
as
begin
  declare @jg varchar(200)
  
  if @cs like '1%'
    --返回原判第一罪名名称
    select top 1 @jg=zmmc+(case when @cs like '%X%' and xq<>'' then '('+dbo.get_mask_xq(xq,2,'')+')' else '' end)
      from zf_zm
      where zf_id=@zf_id and zmxh=1 and pjrq=(select min(pjrq) from zf_zm where zf_id=@zf_id and zmxh=1)
  else
    --返回原判所有罪名名称
    begin
      set @jg=''
      select @jg=@jg+(case when @jg='' then '' else '、' end)+zmmc++(case when @cs like '%X%' and xq<>'' then '('+dbo.get_mask_xq(xq,2,'')+')' else '' end)
        from zf_zm
        where zf_id=@zf_id and zmmc<>'' and pjrq=(select min(pjrq) from zf_zm where zf_id=@zf_id and zmxh=1)
    end
  if @jg is null
    set @jg=''

  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_ypzr]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回原判止日
--select top 1000 dbo.get_ypzr(zf_id,'1') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_ypzr]
(
 @zf_id varchar(50),
 @cs varchar(2)     --返回值格式  0：返回日期字符串20050908   1：返回2005.09.08   2：返回2005年9月8日
)
returns varchar(20)
as
begin
  declare @jg varchar(20)
  
  select top 1 @jg=convert(varchar(8),zr,112) from zf_xfzb where zf_id=@zf_id and iszs='1'
  if @jg is null
    return ''
  else if @cs ='1'
    set @jg=stuff(stuff(@jg,5,0,'.'),8,0,'.')
  else if @cs='2'
    set @jg=left(@jg,4)+'年'+cast(cast(substring(@jg,5,2) as int) as varchar(2))+'月'+cast(cast(substring(@jg,7,2) as int) as varchar(2))+'日'
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_yzjc]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--函数功能：返回狱内奖惩记录字串
--select top 1000 dbo.get_yzjc(zf_id,'20100101',null,'2HAC','4501') from zf_jbxx where zybz='1'

CREATE FUNCTION [dbo].[get_yzjc]
(
 @zf_id varchar(50),
 @qrs datetime,    --日期起（可传NULL）
 @zrs datetime,    --日期止（可传NULL）
 @cs varchar(10),  --返回形式  空或0：返回奖惩串  A:返回尚未用于减刑的奖励串  1H：每记录加换行符  2H：每2个记录加换行符  C：返回的日期为XXXX年X月X日  (参数可连用，如：A1HC)
 @dwbm varchar(4)  --用户单位编码（预留参数，用于用户特殊需求）
)
RETURNS varchar(2000)
AS
BEGIN
  declare @jg varchar(2000),@qr datetime,@zr datetime,@row_rec_num int,@s varchar(100),@n int,@rq_cs tinyint
  set @jg=''
  
  set @qr=(case when @qrs is null then cast(year(dbo.get_today(0))-1 as char(4))+'0101' else @qrs end)  --若日期起为空，默认为去年1月1日
  set @zr=(case when @zrs is null then '99991231' else @zrs end)
  if @cs is null or @cs='0'
    set @cs=''
  set @row_rec_num=3000  --每行记录数变量赋初值
  if @cs like '%H%'
    --读取参数中的每行记录数
    begin
      declare @c varchar(2)
      set @c=substring(@cs,charindex('H',@cs)-1,1)
      if isnumeric(@c)=1
        set @row_rec_num=cast(@c as tinyint)
    end
  set @rq_cs=(case when @cs like '%C%' then 2 else 1 end) --日期格式变量赋值
  set @n=0
  
  if @cs like '%A%'
    --生成尚未用于减刑的奖励游标
    declare cur cursor for
      select dbo.get_mask_date(pzrq,@rq_cs,4)+(case when jclb='' then '奖励(编码无法识别)' else jclb end)
      from (select pzrq,dbo.get_mc('1W',jllb) as jclb from zf_yzjl where zf_id=@zf_id and pzrq between @qr and @zr and yyjx='1' and vaild_flag='Y'
            union
            select pzrq,dbo.get_mc('3L',cclb) as jclb from zf_yzcc where zf_id=@zf_id and '1'='2') as yzjc
      order by pzrq
  else
    --生成奖惩游标
    declare cur cursor for
      select dbo.get_mask_date(pzrq,@rq_cs,4)+(case when jclb='' then (case when lb='1' then '奖励' else '处罚' end)+'(编码无法识别)' else jclb end)
      from (select '1' as lb,pzrq,dbo.get_mc('1W',jllb) as jclb from zf_yzjl where zf_id=@zf_id and pzrq between @qr and @zr and vaild_flag='Y'
            union
            select '2' as lb,pzrq,dbo.get_mc('3L',cclb) as jclb from zf_yzcc where zf_id=@zf_id and pzrq between @qr and @zr and vaild_flag='Y') as yzjc
      order by pzrq

  open cur
  fetch cur into @s
  while @@fetch_status=0
    begin
      set @jg=@jg+@s
      set @n=@n+1
      if @n=@row_rec_num
        begin
          set @jg=@jg+char(10)
          set @n=0
        end
      else
        set @jg=@jg+'，'
      
      fetch cur into @s
    end
  close cur
  deallocate cur
  
  if @jg=''
    set @jg=(case when @cs like '%A%' then '无尚未用于减刑的奖励' else '无狱政奖惩' end)
  else
    begin
      if right(@jg,1)='，'
        set @jg=left(@jg,len(@jg)-1)
    end
  
	return @jg
END




GO
/****** Object:  UserDefinedFunction [dbo].[get_zcyy]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回残犯致残原因名称
--select dbo.get_zcyy(zf_id,null) from zf_jbxx where zybz='1' and dbo.get_zcyy(zf_id,null)<>''

CREATE   function [dbo].[get_zcyy] 
(
 @zf_id varchar(50), 
 @jzrq datetime  --截止时间
)
returns varchar(100) 
as
begin
  declare @jg varchar(100)
  set @jg=''
   
  if @jzrq is null
    --无截止日期
    select @jg=@jg+(case when @jg='' then '' else '、' end)+dbo.get_mc('42',b.zclb) 
      from sw_cfgl a join sw_cfgl_jd b on  a.oid=b.sw_cfgl_oid
      where a.zf_id=@zf_id and a.cxrq is null and b.zclb<>''
      order by b.jdrq  
  else
    --有截止日期
    select  @jg=@jg+(case when @jg='' then '' else '、' end)+ dbo.get_mc('42',b.zclb) 
      from sw_cfgl a join sw_cfgl_jd b on  a.oid=b.sw_cfgl_oid
      where a.zf_id=@zf_id and (b.jdrq<=@jzrq or b.jdrq is null) and (a.cxrq>=@jzrq or a.cxrq is null) and b.zclb<>''
      order by b.jdrq 
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_zf_jk]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[get_zf_jk]
(
 @zf_id varchar(50),   @dwbm varchar(6)  )
returns varchar(8000)
as
begin

declare @s varchar(8000),@is_wjf char(1),@ywm varchar(200),@bqdw varchar(200),@lb varchar(20),@oid varchar(50),@zxlb varchar(2),@nx varchar(40),
        @bqzy varchar(40),@zm varchar(200),@pzrq varchar(20),@xxq varchar(6),@xzr varchar(8),@zybz char(1),@sjbm varchar(2),@ysjrq varchar(40),
        @bwnx varchar(50),@xbcs int,@disp_dw varchar(1),@n int,@zzrq varchar(20),@zzlb varchar(8),@bqzw varchar(40),@rjrq varchar(8)

if not exists (select 1 from zf_jbxx where zf_id=@zf_id)
  return ''

set @is_wjf=''   set @ywm=''      set @bqdw=''     set @bqzy=''     set @disp_dw='1' 
if exists (select 1 from zf_tbgz where zf_id=@zf_id and tbgzlb='18')
  begin
    set @is_wjf='1'
        select @ywm=bhm from zf_qtch where zf_id=@zf_id
        if exists (select 1 from zf_zj where zf_id=@zf_id and zjlx='11')
      select top 1 @ywm=@ywm+(case when @ywm='' then '' else '，' end)+'护照号：'+zjhm from zf_zj where zf_id=@zf_id and zjlx='11'
    if @ywm<>''
      set @ywm='（'+@ywm+'）'
  end

select @bqzy=dbo.get_mc('13',bqzylb),@s=bqzy from zf_jbxx where zf_id=@zf_id
if @bqzy like '%工作人员'
  set @bqzy='工作人员'
if @bqzy='' or @bqzy like '其[它他]%' or @bqzy like '农林%' or @bqzy like '商业%服务业%' or @bqzy like '%[离退]休%'
  set @bqzy=isnull(@s,'')
if @bqzy='' or @bqzy like '其[它他]%' or @bqzy like '农林%'
  set @disp_dw='0'  

select top 1 @bqdw=(case when @bqzy like '%[无个][业体]%' or @bqzy like '%无%' then '' else dbo.get_qhmx(dwqh,dwmx) end),
             @bqzw=(case when zw like '%无%' then '' else isnull(zw,'') end)
  from zf_jl where zf_id=@zf_id and bqbz=1

if replace(replace(@bqdw,')',''),'）','') like '%[判审察主部省厅局县处乡科书事院校民警察查干所队庭站社员经厂法会出人组店狱台][员任长记警察部理计纳]'
  set @bqzy=''
  

set @s=''
select @s='    '+a.xm+@ywm+'，'+(case when a.xb='2' then '女' else '男' end)+
       (case when a.csrq is not null then '，'+dbo.get_mask_date(csrq,2,4)+'出生' else '，' end)+
       (case when @is_wjf='1' then (case when a.gjdq like '99[89]' then '，'+dbo.get_mc('39',gjdq)
                                         when dbo.get_mc('39',a.gjdq)<>'' then '，'+dbo.get_mc('39',a.gjdq)+'国籍'
                                         when len(a.hjqh)=3 and dbo.get_mc('39',a.hjqh)<>'' then '，'+dbo.get_mc('39',a.hjqh)+'国籍'
                                         else '外国籍' end)+(case when (select hy from zf_wjf where zf_id=a.zf_id)=1 then '，华裔' else '' end)
             when dbo.get_mc('1B',a.mz) like '其%' or dbo.get_mc('1B',a.mz)='' then '' else '，'+dbo.get_mc('1B',a.mz) end)+'，'+
       (case when dbo.get_mc('1E',a.bqwhcd)='' then '' else dbo.get_mc('1E',a.bqwhcd)+'文化程度' end)+'。'+
       (case when @bqdw<>'' and @bqzy<>'' and @disp_dw='1' then '捕前系'+@bqdw+@bqzy
             when @bqzy<>''  then '捕前系'+@bqzy else '' end)+
       (case when @bqzw<>'' then '，'+@bqzw else '' end)+                                            (case when dbo.get_mc('15',a.bqzj)='' then '' else '，'+dbo.get_mc('15',a.bqzj) end)+         (case when dbo.get_qhmx(a.jtqh,a.jtmx)='' then ''
             when a.jtmx like '%无%住址%' or a.jtmx like '%不[明详]%'  then '，'+a.jtmx else '，住'+dbo.get_qhmx(a.jtqh,a.jtmx) end)+
       (case when a.jtqh<>a.hjqh and isnull(a.jtqh,'')<>'' and isnull(a.hjqh,'')<>'' then  '（户籍地址'+dbo.get_qhmx(a.hjqh,isnull(a.hjmx,''))+'）' else '' end)+'。',
       @rjrq=isnull(convert(varchar(8),a.rjrq,112),''),        @xxq=isnull(b.xq,''),                                   @xzr=isnull(convert(varchar(8),b.zr,112),''),           @zybz=a.zybz                                       from zf_jbxx a left join zf_xfzb b on a.zf_id=b.zf_id and b.flag='1' where a.zf_id=@zf_id

set @zm=dbo.get_ypzmmc(@zf_id,'2') 


select top 1 @s=@s+dbo.get_mask_date(a.pcrq,2,4)+'经'+
            (case when isnull(a.pcqh,'')+isnull(a.pcmx,'')='' then '人民法院' else isnull(a.pcqh,'')+isnull(a.pcmx,'') end)+
            (case when @zm='' then '' else '以'+@zm+(case when @zm like '%罪' then '' else '罪' end) end)+
            (case when dbo.get_mask_xq(a.xq,'2','')='' then '判决' else dbo.get_mask_xq(a.xq,'2','判处') end)+
            (case when dbo.get_zh(a.pcnd,a.pczh,a.pcxh)='' then '' else '，判决书号：'+dbo.get_zh(a.pcnd,a.pczh,a.pcxh) end)+
            (case when dbo.get_mask_fjx(a.bznx,b.mscc,b.fjje,a.qzcj,'2')='' then '' else '，附加'+dbo.get_mask_fjx(a.bznx,b.mscc,b.fjje,a.qzcj,'2') end)+
            (case when a.xq like '99%' or a.xq='' then ''
                  when isnull(qr,'')<>'' and isnull(zr,'')<>'' then '，刑期自'+dbo.get_mask_date(qr,2,4)+'至'+dbo.get_mask_date(zr,2,4) else '' end)+'。'
  from zf_xfzb a left join zf_xfzb_fb b on a.oid=b.zf_xfzb_oid where a.zf_id=@zf_id and a.iszs='1'
 

declare @syrq varchar(8),@sylb varchar(4),@syjg varchar(8),@symx varchar(100),@gydw varchar(8),@gydw_mc varchar(100),
        @ljrq varchar(8),@ljlb varchar(6),@qxqh varchar(8),@qxmx varchar(100),@gysf varchar(100),@syjg_mc varchar(100)
set @n=0

declare cur cursor for
  select oid,
         sylb,             isnull(convert(varchar(8),syrq,112),''),           isnull(syjg,''),             isnull(symx,''),             isnull(gydw,''),             isnull(convert(varchar(8),ljrq,112),''),           isnull(ljlb,''),             isnull(qxqh,''),             isnull(qxmx,'')         from zf_crj where zf_id=@zf_id order by syrq,(case when ljrq is null then '99991231' else ljrq end),cjsj
open cur
fetch cur into @oid,@sylb,@syrq,@syjg,@symx,@gydw,@ljrq,@ljlb,@qxqh,@qxmx  
while @@fetch_status=0
  begin
    set @n=@n+1
    if @sylb in ('4','5','6','7')
            begin
        if @syjg+@symx=''
          set @syjg_mc='监狱'
        else
          begin
            set @syjg_mc=dbo.get_mc('1Z',@syjg)
            if @sylb='6'
                            begin
                set @gysf=dbo.get_mc('14',left(@syjg,2))                  if len(@syjg)=4 and right(@syjg,2)<>'00'
                                    begin
                    if @syjg_mc=''
                                            set @syjg_mc=@gysf+'某监狱'
                    else
                                            set @syjg_mc=(case when @syjg_mc like @gysf+'%' then @syjg_mc else @gysf+@syjg_mc end)
                  end
                else if len(@syjg)=4 and right(@syjg,2)='00'
                                    begin
                    if  @symx=''
                                            set @syjg_mc=@gysf+'某监狱'
                    else
                      set @syjg_mc=(case when @symx like @gysf+'%' then @symx else @gysf+@symx end)
                  end
              end
          end
      end
    else if @sylb='3'
            begin
        set @zm=''
        select top 1 @zm=dbo.get_zm_bypjrq(oid,'',@dwbm) from zf_xfzb where zf_id=@zf_id and bdlb='17' and pcrq between dateadd(month,-6,@syrq) and dateadd(month,1,@syrq)
        if @zm<>'' and @zm not like '%罪'
          set @zm=@zm+'罪'
      end
    
    if @n=1
            begin
                if @gydw=''
          set @gydw_mc='监狱'
        else
          begin
            set @gydw_mc=dbo.get_mc('1Z',@gydw)
            if @gydw_mc=''
              set @gydw_mc='监狱'
            if left(@gydw,2)<>left(@dwbm,2)
                            begin
                if @gydw_mc not like dbo.get_mc('1Z',left(@gydw,2))+'%'
                                    set @gydw_mc=dbo.get_mc('1Z',left(@gydw,2))+@gydw_mc
              end
          end
        
        set @s=@s+dbo.get_mask_date(@rjrq,2,4)          
        if @sylb='1'
                    set @s=@s+'送'+@gydw_mc+'服刑'
        else if @sylb in ('4','5','6','7')
                    begin
                        set @s=@s++'送'+@syjg_mc+'服刑'
                        set @s=@s+(case when dbo.get_mc('1Z',@gydw)='' then '' else '，'+dbo.get_mask_date(@syrq,2,4)+'调'+dbo.get_mc('1Z',@gydw) end)
          end
        else if @sylb='3'
                    set @s=@s+'送监狱服刑，后假释，假释期间因'+(case when @zm='' then +'违反相关规定' else '犯'+@zm end)+'于'+dbo.get_mask_date(@syrq,2,4)+'收监'
        else
                    set @s=@s+'送'+@gydw_mc+'服刑'
      end
    else
            begin
        if @sylb in ('4','5','6','7')
                    set @s=@s+''
        else if @sylb='3'
                    set @s=@s+'假释期间因'+(case when @zm='' then '违反相关规定' else '犯'+@zm end)+'于'+dbo.get_mask_date(@syrq,2,4)+'收监'
        else
                    set @s=@s+dbo.get_mask_date(@syrq,2,4)+dbo.get_mc('2Y',@sylb)
      end
    
    if @ljrq<>''
            begin
        set @s=@s+'，'
        if @ljlb in ('24','25','26','27')
          set @s=@s+ '，'+dbo.get_mask_date(@ljrq,2,4)+(case when dbo.get_qhmx(@qxqh,@qxmx)='' then '调其他监狱' else '调'+dbo.get_qhmx(@qxqh,@qxmx) end)
        else if @ljlb='9'
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'病亡'
        else if @ljlb='10'
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'死亡'
        else if @ljlb in ('35','36')
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'监外执行期间病亡'
        else if @ljlb in ('37','38')
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'监外执行期间死亡' 
        else if @ljlb='12'
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'因其他罪犯行凶致死'
        else if @ljlb in ('13','15','16')
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'因'+dbo.get_mc('1P',@ljlb)          else if @ljlb='17'
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'在抢险救灾时死亡'
        else if @ljlb='18'
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'死亡'                               else if @ljlb in ('19','20')
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'被'+dbo.get_mc('1P',@ljlb)          else if @ljlb in ('39','20')
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'被解回再审后处决'
        else if dbo.get_mc('1P',@ljlb)=''
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+'离监'+(case when dbo.get_qhmx(@qxqh,@qxmx)='' then '' else '，去向'+dbo.get_qhmx(@qxqh,@qxmx) end)
        else
          set @s=@s+'，于'+dbo.get_mask_date(@ljrq,2,4)+dbo.get_mc('1P',@ljlb)
      end
    
    fetch cur into @oid,@sylb,@syrq,@syjg,@symx,@gydw,@ljrq,@ljlb,@qxqh,@qxmx
  end
close cur
deallocate cur

if @zybz='1'
  begin
    set @s=@s+'。'
        if exists (select 1 from zc_tt where zf_id=@zf_id and ttrq is not null and bhrq is null)
            select top 1 @s=@s+'，于'+dbo.get_mask_date(ttrq,2,4)+'脱逃，目前在逃'
        from zc_tt where zf_id=@zf_id and ttrq is not null and bhrq is null
    else if exists (select 1 from zf_jwzx where zf_id=@zf_id and pzrq is not null and zzrq is null)
            begin
                select top 1 @oid=oid from zf_jwzx where zf_id=@zf_id and pzrq is not null and zzrq is null
                select @xbcs=count(*) from zf_jwzx_xb where zf_jwzx_oid=@oid
                set @nx=dbo.get_jwzxxx(@zf_id,@oid,null,'52')
                set @ysjrq=dbo.get_jwzx_ysjrq(@zf_id,@oid,null)
        if @ysjrq like '%刑满%' or isnull(@ysjrq,'')=''
          set @ysjrq=''
        else
          set @ysjrq='，至'+dbo.get_mask_date(@ysjrq,2,4)+'止'

                select @s=@s+(case when zxlb<>'1' then '因'+dbo.get_mc('1T',zxlb) else '' end)+
                  '于'+dbo.get_mask_date(pzrq,2,4)+'批准'+(case when zxlb='1' then '保外就医' else '监外执行' end)+'，期限'+
                  (case when isnull(bwnx,'')='' or bwnx like '99%' then '至刑满' else dbo.get_mask_xq(bwnx,2,'') end)+
                  (case when @xbcs>0 then '，后续保'+cast(@xbcs as varchar(3))+'次，期限'+(case when @nx like '%刑满%' then '至刑满' else '共计'+@nx+@ysjrq end) else '' end),
                  @zxlb=zxlb
          from zf_jwzx where oid=@oid
        if exists (select 1 from zf_jwzx_tg where zf_jwzx_oid=@oid and tgqr is not null and tgzr is null)
                    select top 1 @s=@s+'，'+dbo.get_mask_date(tgqr,2,4)+'监外执行期间脱管至今'
            from zf_jwzx_tg where zf_jwzx_oid=@oid and tgqr is not null and tgzr is null
        else
          begin
            set @s=@s+'，目前处于监外执行中'
                        set @lb=dbo.get_jwzxxx(@zf_id,@oid,null,'2')
            if @zxlb<>@lb
                            select top 1 @s=@s+'（'+dbo.get_mask_date(pzrq,2,4)+'批准监外执行原因改为'+dbo.get_mc('1T',@lb)+'）'
                from zf_jwzx_xb where zf_jwzx_oid=@oid order by pzrq desc
          end
      end
    else if exists (select 1 from zf_jhzs where zf_id=@zf_id and tjrq is not null and zzrq is null)
            select @s=@s+'，于'+dbo.get_mask_date(pzrq,2,4)+(case when isnull(dwqh,'')+isnull(dwmx,'')='' then '' else '被'+isnull(dwqh,'')+isnull(dwmx,'') end)+'解回再审，尚未送回'
        from zf_jhzs where zf_id=@zf_id and tjrq is not null and zzrq is null
  end
set @s=@s+'。'

declare @bdlb varchar(4),@pcrq varchar(40),@pjrq varchar(8),@pcjg varchar(100),@bdfd varchar(6),@xq varchar(6),
        @is_disp_xq char(1),@s_xfbd varchar(5000),@num_xfbd int,@is_jx char(1)

set @is_disp_xq=''  
set @s_xfbd=''
set @num_xfbd=0
declare cur cursor for
  select top 100 oid,bdlb,dbo.get_mask_date(pcrq,2,4) as pcrq,isnull(convert(varchar(8),pcrq,112),'') as pjrq,isnull(pcqh,'')+isnull(pcmx,''),isnull(bdfd,''),isnull(xq,'')
    from zf_xfzb
    where zf_id=@zf_id
          and pcrq>(select pcrq from zf_xfzb where zf_id=@zf_id and iszs='1')                           and bdlb not in ('9','10','11','12','13','14','15','16','17','18','20','21','99')             and oid not in (select zf_xfzb_oid from zf_xfzb_cxjx where zf_id=@zf_id)                order by pcrq
open cur
fetch cur into @oid,@bdlb,@pcrq,@pjrq,@pcjg,@bdfd,@xq
while @@fetch_status=0
  begin
    set @s_xfbd=@s_xfbd+@pcrq
    set @num_xfbd=@num_xfbd+1    
	  if @bdlb in ('7','8')
            begin
        set @s_xfbd=@s_xfbd+(case when @pcjg='' then '' else '经'+@pcjg+'裁定' end)
		
        if @xq like '999[56]'
          begin
            set @s_xfbd=@s_xfbd+'减为'+(case when @xq='9996' then '死缓' else '无期徒刑' end)
            set @is_disp_xq='0'
          end
        else if @bdfd='9990'
          begin
            set @s_xfbd=@s_xfbd+'减为有期徒刑'+dbo.get_mask_xq(@xq,2,'')
            set @is_disp_xq='0'
          end
        else if @bdfd<>'' and @bdfd not like '99%'
          begin
            set @s_xfbd=@s_xfbd+'减刑'+dbo.get_mask_xq(@bdfd,2,'')
            set @is_disp_xq='1'
          end
        else
          begin
            set @s_xfbd=@s_xfbd+'减刑'
            set @is_disp_xq='1'
          end
      end
    else if @bdlb in ('3','4','5','6')
            begin
        set @is_jx='1'          set @zm=''
        if @pjrq<>''
          begin
            set @zm=dbo.get_zm_bypjrq(@oid,'',@dwbm)             if @zm<>'' and @zm not like '%罪'
              set @zm=@zm+'罪'
          end
        set @s_xfbd=@s_xfbd+(case when @pcjg='' then '' else '经'+@pcjg+(case when @zm='' then '' else '以'+@zm end)+'判决' end)
        if @bdlb='3'
                    begin
            if @xq<=(select top 1 xq from zf_xfzb where zf_id=@zf_id and pcrq<@pcrq order by pcrq desc)
                            begin
                set @is_jx='0'                  if @xq like '999[56]'
                  begin
                    set @s_xfbd=@s_xfbd+'刑期'+(case when @xq='9996' then '死缓' else '无期徒刑' end)
                    set @is_disp_xq='0'
                  end
                else
                  set @s_xfbd=@s_xfbd+'刑期'+dbo.get_mask_xq(@xq,2,'')
              end
          end
        if @is_jx='1'
                    begin
            if @xq like '999[56]'
              begin
                set @s_xfbd=@s_xfbd+'刑期加至'+(case when @xq='9996' then '死缓' else '无期徒刑' end)
                set @is_disp_xq='0'
              end
            else if @bdfd<>'' and @bdfd not like '99%'
              begin
                set @s_xfbd=@s_xfbd+'加刑'+dbo.get_mask_xq(@bdfd,2,'')
                set @is_disp_xq='1'
              end
            else
              begin
                set @s_xfbd=@s_xfbd+'加刑'
                set @is_disp_xq='1'
              end
          end
      end
    else if @bdlb='2'
            begin
        set @zm=''
        if @pjrq<>''
          begin
            set @zm=dbo.get_zm_bypjrq(@oid,'',@dwbm)             if @zm<>'' and @zm not like '%罪'
              set @zm=@zm+'罪'
          end
        set @s_xfbd=@s_xfbd+(case when @pcjg='' then '' else '经'+@pcjg+(case when @zm='' then '' else '以'+@zm end) end)+'改判'
        if @xq like '999[56]'
          begin
            set @s_xfbd=@s_xfbd+'为'+(case when @xq='9996' then '死缓' else '无期徒刑' end)
            set @is_disp_xq='0'
          end
        else
          set @s_xfbd=@s_xfbd+'刑期为'+dbo.get_mask_xq(@xq,2,'')
        set @is_disp_xq='0'
      end
    else
        begin
		-----hl
		return @s
        set @s_xfbd=@s_xfbd+(case when @pcjg='' then '' else '经'+@pcjg end)+'判决'+dbo.get_mc('1Q',@bdlb)
        set @is_disp_xq='1'
      end
   
    set @s_xfbd=@s_xfbd+'，'
    fetch cur into @oid,@bdlb,@pcrq,@pjrq,@pcjg,@bdfd,@xq
  end
close cur
deallocate cur

if @zybz='1'
    begin
    set @s=@s+@s_xfbd
    if @is_disp_xq<>''
      begin
        if @is_disp_xq='1'
          set @s=@s+'，目前刑期为'+
                 (case when @xxq='9996' then '死缓' when @xxq='9995' then '无期徒刑' else dbo.get_mask_xq(@xxq,2,'') end)+
                 (case when @xxq like '99%' or @xzr='' then '' else '，截至'+dbo.get_mask_date(@xzr,2,4) end)+'。'
        else
          set @s=@s+(case when @xxq like '99%' or @xzr='' then '' else '，目前刑期截至'+dbo.get_mask_date(@xzr,2,4) end)+'。'
      end
  end
else
    begin
    if @num_xfbd>0
            set @s=@s+'服刑期内，'+@s_xfbd+'，'
  end

if exists (select 1 from zf_jwzx where zf_id=@zf_id and zzrq is not null)
  begin
    set @s=@s+(case when @zybz='1' then '该犯曾' else (case when @s like '%服刑期内%' then '曾' else '服刑期内，曾' end) end)
    
        declare cur cursor for
      select a.oid,convert(varchar(8),a.pzrq,112),a.zxlb,dbo.get_mask_date(a.zzrq,2,4),a.zzlb,b.sjbm from zf_jwzx a left join pub_dmb b on a.zzlb=b.bm and b.lb='1S'
        where a.zf_id=@zf_id and a.zzrq is not null
        order by pzrq
    open cur
    fetch cur into @oid,@pzrq,@zxlb,@zzrq,@zzlb,@sjbm
    while @@fetch_status=0
      begin
                select @xbcs=count(*) from zf_jwzx_xb where zf_jwzx_oid=@oid
                set @nx=dbo.get_jwzxxx(@zf_id,@oid,null,'52')
        if @nx like '%刑满%' or isnull(@nx,'')=''
          set @nx=''
        else if @xbcs>0
          set @nx='期限共计'+@nx
        else
          set @nx='期限'+@nx
        
                set @s=@s+(case when @zxlb<>'1' then '因'+dbo.get_mc('1T',@zxlb) else '' end)+
                  '于'+dbo.get_mask_date(@pzrq,2,4)+'批准'+(case when @zxlb='1' then '保外就医' else '监外执行' end)+'，'+(case when @nx='' then '' else @nx+'，' end)+
                  (case when @xbcs>0 then '期间续保'+cast(@xbcs as varchar(3))+'次，' else '' end)
        set @s=@s+(case when @zzlb='1' or @sjbm='1' then @zzrq+'收监'                           when @zzlb='5' or @sjbm='5' then @zzrq+'因'+replace(dbo.get_mc('1S',@zzlb),'收监','被收监')                          when @zzlb='8' or @sjbm='8' then @zzrq+'因监外执行期间又犯罪被收监'
                        when @zzlb='9' or @sjbm='9' then @zzrq+'监外执行期间调其它监狱'
                        when @zzlb='10' then '至'+@zzrq+'释放止'
                        when @zzlb='11' then '至'+@zzrq+'假释止'
                        when @zzlb='12' then '至'+@zzrq+'病亡'
                        when @zzlb='13' then '至'+@zzrq+'死亡'
                        else '至'+@zzrq+dbo.get_mc('1S',@zzlb)+'止' end)
        if exists (select 1 from zf_jwzx_tg where zf_jwzx_oid=@oid and tgqr is not null)
                    set @s=@s+'，监外执行期间曾脱管'
        fetch cur into @oid,@pzrq,@zxlb,@zzrq,@zzlb,@sjbm
      end
    close cur
    deallocate cur
    set @s=@s+'。'
  end

if right(@s,1)='，'
  set @s=left(@s,len(@s)-1)+'。'
if right(@s,1)<>'。'
  set @s=@s+'。'
set @s=replace(replace(replace(replace(@s,'，。','。'),'。，','。'),'，，','，'),'。。','。')
return @s
end
GO
/****** Object:  UserDefinedFunction [dbo].[get_zh]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--根据字号的“年度”“字”“序号”生成标准的字号
--select top 1000 dbo.get_zh(pcnd,pczh,pcxh) from zf_xfzb where pczh<>''

CREATE function [dbo].[get_zh] 
(
 @nd int,          --年度
 @zh varchar(60),  --字
 @xh varchar(40)   --序号
)  
returns varchar(100)  

as
begin  
  declare @jg varchar(100)
  set @jg=''
  
  if @nd<>0
    set @jg='('+cast(@nd as varchar(4))+')'
  
  if @zh<>''
    begin
      if @zh like '%第'
        set @zh=left(@zh,len(@zh)-1)
      set @jg=@jg+@zh+(case when @zh like '%字%' then '' else '字' end)
    end

  if @xh<>''
    set @jg=@jg+(case when @xh like '第%' then '' else '第' end)+@xh+(case when @xh like '%号' then '' else '号' end)
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_zm_bypjrq]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回某次判决的罪名名称串
--select top 1000 dbo.get_zm_bypjrq(oid,'','4501') from zf_xfzb where iszs='1'

CREATE function [dbo].[get_zm_bypjrq]
(
 @xfzb_oid varchar(50),  --刑罚表OID
 @cs varchar(6),   --返回值参数   空串：返回该次判决所有罪名(不含重复罪名)  X：罪名后有刑期，如：盗窃(5年)   C:含重复罪名 （参数可组合使用）
 @dwbm varchar(4)  --用户单位编码（用于用户特殊需求）
)
returns varchar(200)
as
begin
  declare @jg varchar(200)
  set @jg=''

  if @cs like '%C%'
    --含重复罪名 
    select @jg=@jg+(case when @jg='' then '' else '、' end)+zmmc+(case when @cs like '%X%' and xq<>'' then '('+dbo.get_mask_xq(xq,2,'')+')' else '' end)
      from zf_zm a
      where zf_xfzb_oid=@xfzb_oid and zmmc<>''
      order by zmxh
  else
    --不含重复罪名
    select @jg=@jg+(case when @jg='' then '' else '、' end)+zmmc+(case when @cs like '%X%' and xq<>'' then '('+dbo.get_mask_xq(xq,2,'')+')' else '' end)
      from zf_zm a
      where zf_xfzb_oid=@xfzb_oid and zmmc<>''
            and not exists (select 1 from zf_zm where zf_xfzb_oid=@xfzb_oid and zmmc=a.zmmc and zmxh>a.zmxh)
      order by zmxh
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_zmbm]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回截止日期时的罪名编码
--select top 1000 dbo.get_zmbm(zf_id,rjrq,'2') from zf_jbxx where zybz='1'

CREATE  function [dbo].[get_zmbm]
(
 @zf_id varchar(50),  --罪犯ID
 @jzrq datetime,      --截止日期 (传 NULL 为当前日期)
 @cs varchar(6)       --返回值形式  1：返回第一罪名编码    2：返回所有罪名编码（逗号分隔）
)
returns varchar(100)
as
begin
  declare @jg varchar(100),@pjrq datetime
  set @jg=''
  
  if @jzrq is null and @cs='1'
    --无截止日期 读取基本信息表的第一罪名编码
    select @jg=zmfl from zf_jbxx where zf_id=@zf_id
  else
    begin
      --读取判决日期
      if @jzrq is null
        --无截止日期 读取罪名表罪名序号=1的最大判决日期
        select @pjrq=max(pjrq) from zf_zm where zf_id=@zf_id and zmxh=1
      else
        --有截止日期 读取截止日期之前罪名序号=1的最大判决日期
        select @pjrq=max(pjrq) from zf_zm where zf_id=@zf_id and pjrq<=@jzrq and zmxh=1
      
      if @pjrq is null
        --判决日期为NULL，从刑罚表读取判决日期
        select top 1 @pjrq=a.pcrq
          from zf_xfzb a
          where a.zf_id=@zf_id and a.pcrq is not null and (a.iszs='1' or a.bdlb in ('1','2','3','21'))  --1判决  2改判  3解回重新判决  21刑罚合并 
                and exists (select 1 from zf_zm where zf_id=@zf_id and pjrq=a.pcrq)
          order by a.pcrq desc
      
      if @cs='1'
        --读取第一罪名编码
        select top 1 @jg=zmfl
          from zf_zm
          where zf_id=@zf_id and pjrq=@pjrq and zmxh=1
      else
        --读取所有罪名编码
        begin
          if @jzrq is null
            --无截止日期
            select @jg=@jg+(case when @jg='' then '' else ',' end)+zmfl
              from zf_zm
              where zf_id=@zf_id and pjrq>=@pjrq order by pjrq,zmxh
          else
            --有截止日期
            select @jg=@jg+(case when @jg='' then '' else ',' end)+zmfl
              from zf_zm
              where zf_id=@zf_id and pjrq between @pjrq and @jzrq order by pjrq,zmxh
        end
    end
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_zmmc]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回第一罪名名称 或 所有罪名名称
--select top 1000 dbo.get_zmmc(zf_id,null,'2') from zf_jbxx where zybz='1'

CREATE function [dbo].[get_zmmc]
(
 @zf_id varchar(50), --罪犯编号/罪犯ID
 @jzrqs datetime,    --截止日期 (传 NULL 为当前日期)
 @cs varchar(6)      --返回值形式   1:返回第一罪名名称   2：返回所有罪名名称    附加参数 X：罪名后有刑期，如：盗窃(5年)   C:含重复罪名 （附加参数可组合使用）
)
returns varchar(400)
as
begin
  declare @jg varchar(400)
  
  if @jzrqs is null and @cs='2'
    --无截止日期  返回所有罪名名称  （不含刑期）
    select @jg=syzm from zf_jbxx where zf_id=@zf_id
  else
    begin
      declare @pjrq datetime,@jzrq datetime
      set @jg=''
      
      --读取判决日期
      if @jzrq is null
        --无截止日期 读取罪名表罪名序号=1的最大判决日期
        begin
          select @pjrq=max(pjrq) from zf_zm where zf_id=@zf_id and zmxh=1
          set @jzrq='99991231'
        end
      else
        --有截止日期 读取截止日期之前罪名序号=1的最大判决日期
        begin
          select @pjrq=max(pjrq) from zf_zm where zf_id=@zf_id and pjrq<=@jzrq and zmxh=1
          set @jzrq=@jzrqs
        end
      
      if @pjrq is null
        --判决日期为NULL，从刑罚表读取判决日期
        select top 1 @pjrq=a.pcrq
          from zf_xfzb a
          where a.zf_id=@zf_id and a.pcrq is not null and (a.iszs='1' or a.bdlb in ('1','2','3','21'))  --1判决  2改判  3解回重新判决  21刑罚合并 
                and exists (select 1 from zf_zm where zf_id=@zf_id and pjrq=a.pcrq)
          order by a.pcrq desc
        
      if @cs like '1%'
        --读取第一罪名名称
        select top 1 @jg=zmmc+(case when @cs like '%X%' and xq<>'' then '('+dbo.get_mask_xq(xq,2,'')+')' else '' end)
          from zf_zm
          where zf_id=@zf_id and pjrq=@pjrq and zmxh=1
      else
        --读取所有罪名
        begin
          if @cs like '%C%'
            --含重复罪名
            select @jg=@jg+(case when @jg='' then '' else '、' end)+zmmc+(case when @cs like '%X%' and xq<>'' then '('+dbo.get_mask_xq(xq,2,'')+')' else '' end)
              from zf_zm
              where zf_id=@zf_id and pjrq between @pjrq and @jzrq and zmmc<>''  order by pjrq,zmxh
          else
            --不含重复罪名
            select @jg=@jg+(case when @jg='' then '' else '、' end)+a.zmmc+(case when @cs like '%X%' and a.xq<>'' then '('+dbo.get_mask_xq(a.xq,2,'')+')' else '' end)
              from zf_zm a
              where a.zf_id=@zf_id and a.pjrq between @pjrq and @jzrq and zmmc<>''
                    and not exists (select 1 from zf_zm where zf_id=@zf_id and zmmc=a.zmmc and (zmxh<a.zmxh or pjrq<a.pjrq))
              order by pjrq,zmxh
        end
    end
  
  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_zr]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回刑期止日
--select top 1000 dbo.get_zr(zf_id,null,'1') from zf_jbxx where zybz='1'

CREATE   function [dbo].[get_zr]
(
 @zf_id varchar(50),
 @jzrq datetime,    --截止日期(传NULL 表示当前日期)
 @cs varchar(2)     --返回值格式参数  0：返回日期字符串20050908   1：返回2005.09.08   2：返回2005年9月8日
)
returns varchar(40)

as
begin
  declare @jg varchar(40)
  
  if @jzrq is null
    --读取最新止日
    select top 1 @jg=convert(varchar(8),zr,112) from zf_xfzb where zf_id=@zf_id and flag='1'
  else
    --读取截止日期前的止日
    select top 1 @jg=convert(varchar(8),zr,112) from zf_xfzb where zf_id=@zf_id and pcrq<=@jzrq and pcrq>=(select pcrq from zf_xfzb where zf_id=@zf_id and iszs='1') order by pcrq desc,cjsj desc
  
  if @jg is null
    return ''
  else if @cs in ('1','2')
    begin
      if @cs='1'
         --2005.01.01的形式
        set @jg=stuff(stuff(@jg,5,0,'.'),8,0,'.')
      else if @cs='2'
        --2005年1月1日的形式
        set @jg=left(@jg,4)+'年'+cast(cast(substring(@jg,5,2) as int) as varchar(2))+'月'+cast(cast(substring(@jg,7,2) as int) as varchar(2))+'日'
    end
  
  return @jg
end




GO
/****** Object:  UserDefinedFunction [dbo].[get_zybz]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--判断截止日期时是否在押 返回值 1:在押  3:离监
--select top 1000 dbo.get_zybz(zf_id,'20121231') from zf_jbxx 

CREATE  function [dbo].[get_zybz]
(
 @zf_id varchar(50),
 @jzrq datetime    --截止日期(不允许传NULL)
)
returns char(1)
as
begin
  declare @jg char(1)
  select top 1 @jg=(case when ljrq>@jzrq or ljrq is null then '1' else '3' end)
    from zf_crj where zf_id=@zf_id and (syrq<=@jzrq or syrq is null) order by syrq desc,cjsj desc

  return @jg
end



GO
/****** Object:  UserDefinedFunction [dbo].[get_zyxz]    Script Date: 2014/11/29 11:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--返回在押现状名称
--select top 1000 dbo.get_zyxz(zf_id,null,zybz,'') from zf_jbxx where zybz='1'

CREATE  function [dbo].[get_zyxz] 
(
 @zf_id varchar(50),
 @jzrq datetime,    --截止日期（NULL表示当前日期）
 @zybz char(1),     --ZD_JBXX表的在押标志
 @cs varchar(2),    --返回值参数  1：简略提示（无日期）  2：完整提示（有日期）
 @dwbm varchar(4)   --用户单位编码（用于用户特殊需求）
)
returns varchar(60)
as
begin
  declare @jg varchar(60),@jwzx_oid char(32),@today datetime
  set @jg=''
  select @today=output from vw_today  --当日日期
  
  if @jzrq is null
    --无截止日期，判断当前情况
    begin
      if @zybz='3'
        --已离监
        begin
          select @jg=dbo.get_mc('1P',ljlb) from zf_crj where zf_id=@zf_id and GYDW_FLAG='1'
          if @jg='' or @jg is null
            set @jg='离监'
        end
      else
        begin
          --监外执行
          select top 1 @jg=(case when exists (select 1 from zf_jwzx_xb where zf_jwzx_oid=a.oid)
                                 then (select top 1 (case when zxlb<>'1' then '监外执行：' else '' end)+dbo.get_mc('1T',zxlb) from zf_jwzx_xb where zf_jwzx_oid=a.oid order by pzrq desc)
                                 else (case when a.zxlb<>'1' then '监外执行：' else '' end)+dbo.get_mc('1T',a.zxlb) end)+
                           '('+convert(varchar(10),a.pzrq,102)+'批准)',
                       @jwzx_oid=oid
            from zf_jwzx a where a.zf_id=@zf_id and a.zzrq is null
          if @jg<>''
            --判断是否脱管
            select top 1 @jg=replace(@jg,'批准)','批准 '+convert(varchar(10),tgqr,102)+'脱管)')
              from zf_jwzx_tg
              where zf_jwzx_oid=@jwzx_oid and isdate(tgqr)=1 and tgzr is null
          if @jg=''
            --解回
            select top 1 @jg='解回再审'+(case when dwqh+dwmx<>'' then '('+dwqh+dwmx+convert(varchar(10),tjrq,102)+'提解)' else '' end)
              from zf_jhzs where zf_id=@zf_id and zzrq is null
          if @jg=''
            --在逃
            select top 1 @jg='在逃('+convert(varchar(10),ttrq,102)+'脱逃)'
              from zc_tt where zf_id=@zf_id and bhrq is null
          if @jg=''
            --隔离审查
            select top 1 @jg='隔离审查('+convert(varchar(10),pzrq,102)+'批准)'
              from zf_glsc where zf_id=@zf_id and sczr is null
          if @jg=''
            --禁闭
            select top 1 @jg='禁闭('+convert(varchar(10),pzrq,102)+'批准)'
              from zf_yzcc where zf_id=@zf_id and cczr is null
          if @jg=''
            --三停
            select top 1 @jg='在押('+dbo.get_mc('7B',stlb)+' '+convert(varchar(10),pzrq,102)+'批准)'
              from zf_st where zf_id=@zf_id and stzr is null and pzrq>=dateadd(month,-6,@today)
          if @jg=''
            --离监探亲
            select top 1 @jg='离监探亲('+convert(varchar(10),jqqr,102)+'离监)'
              from zf_ljtq where zf_id=@zf_id and gjrq is null
          if @jg=''
            --出监住院
            select top 1 @jg=dbo.get_mc('7K',jzlb)+'('+convert(varchar(10),jzzyrq,102)+yymc+'就诊)'
              from sw_jbyl where zf_id=@zf_id and jzlb in ('6','7','8') and jzzyrq is not null and cyrq is null
        end
    end
  else
    --有截止日期
    begin
      declare @ljrq datetime
      select top 1 @jg=dbo.get_mc('1P',ljlb),@ljrq=ljrq from zf_crj where zf_id=@zf_id and (syrq<=@jzrq or syrq is null) order by syrq desc 
      if @jg<>'' or @ljrq is not null
        --已离监
        begin
          if @jg='' or @jg is null
            set @jg='离监'
        end
      else
        begin
          --监外执行
          select top 1 @jg=(case when exists (select 1 from zf_jwzx_xb where zf_jwzx_oid=a.oid and pzrq<=@jzrq)
                                 then (select top 1 (case when zxlb<>'1' then '监外执行：' else '' end)+dbo.get_mc('1T',zxlb) from zf_jwzx_xb where zf_jwzx_oid=a.oid and pzrq<=@jzrq order by pzrq desc)
                                 else (case when a.zxlb<>'1' then '监外执行：' else '' end)+dbo.get_mc('1T',a.zxlb) end)+
                           '('+convert(varchar(10),a.pzrq,102)+'批准)',
                       @jwzx_oid=oid
            from zf_jwzx a where a.zf_id=@zf_id and a.pzrq<=@jzrq and (a.zzrq is null or a.zzrq>@jzrq)
          if @jg<>''
            --判断是否脱管
            select top 1 @jg=replace(@jg,'批准)','批准 '+convert(varchar(10),tgqr,102)+'脱管)')
              from zf_jwzx_tg
              where zf_jwzx_oid=@jwzx_oid and tgqr<=@jzrq and (tgzr is null or tgzr>@jzrq)
          if @jg=''
            --解回
            select top 1 @jg='解回再审'+(case when dwqh+dwmx<>'' then '('+dwqh+dwmx+convert(varchar(10),tjrq,102)+'提解)' else '' end)
              from zf_jhzs where zf_id=@zf_id and (tjrq<=@jzrq or tjrq is null) and (zzrq is null or zzrq>@jzrq)
          if @jg=''
            --在逃
            select top 1 @jg='在逃('+convert(varchar(10),ttrq,102)+'脱逃)'
              from zc_tt where zf_id=@zf_id and (ttrq<=@jzrq or ttrq is null) and (bhrq is null or bhrq>@jzrq)
          if @jg=''
            --隔离审查
            select top 1 @jg='隔离审查('+convert(varchar(10),pzrq,102)+'批准)'
              from zf_glsc where zf_id=@zf_id and pzrq<=@jzrq and (sczr is null or sczr>@jzrq)
          if @jg=''
            --禁闭
            select top 1 @jg='禁闭('+convert(varchar(10),pzrq,102)+'批准)'
              from zf_yzcc where zf_id=@zf_id and pzrq<=@jzrq and (cczr is null or cczr>@jzrq)
          if @jg=''
            --三停
            select top 1 @jg='在押('+dbo.get_mc('7B',stlb)+' '+convert(varchar(10),pzrq,102)+'批准)'
              from zf_st where zf_id=@zf_id and pzrq<=@jzrq and (stzr is null or stzr>@jzrq)
          if @jg=''
            --离监探亲
            select top 1 @jg='离监探亲('+convert(varchar(10),jqqr,102)+'离监)'
              from zf_ljtq where zf_id=@zf_id and (pzrq<=@jzrq or pzrq is null) and (gjrq is null or gjrq>@jzrq)
          if @jg=''
            --出监住院
            select top 1 @jg=dbo.get_mc('7K',jzlb)+'('+convert(varchar(10),jzzyrq,102)+yymc+'就诊)'
              from sw_jbyl where zf_id=@zf_id and jzlb in ('6','7','8') and (jzzyrq<=@jzrq or jzzyrq is null) and (cyrq is null or cyrq>@jzrq)
        end
    end

  if @jg='' or @jg is null
     set @jg='在押'

  return @jg
end



GO
