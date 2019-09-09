/**
 * 
 */
package com.entlogic.h5.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <p>
 * Title: 业务命令:
 * </p>
 * <p>
 * Description: 业务命令
 * </p>
 * <p>
 * Copyright:2013-2014 gerfalcon Rights Reserved
 * </p>
 * <p>
 * Organization: gerfalcon.org
 * </p>
 * 
 * @author horus.mo
 * @version 1.0
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
public @interface BpCommand
{
	/**
	 * 是否注册业务命令，默认 <b>false</b>
	 */
	String registedName() default "后台方法";

	/**
	 * 是否记录业务命令日志，默认<b> false</b>
	 */
	boolean logged() default false;

	/**
	 * 是否对业务命令使用事务，默认 <b>true</b>
	 */
	boolean transaction() default false;
}
