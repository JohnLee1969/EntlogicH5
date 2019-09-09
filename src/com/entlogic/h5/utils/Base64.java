package com.entlogic.h5.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class Base64 {
	/**
	 * 加密
	 */
	public static String base64_encode(String str) {
		byte[] b = null;
		String s = null;
		try {
			if (str == null)
				return "";
			b = str.getBytes("utf-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		if (b != null) {
			s = new BASE64Encoder().encode(b);
		}
		return s;
	}

	/**
	 * 加密
	 */
	public static String base64_encode(byte[] data) {
		byte[] b = null;
		String s = null;

		if (data != null) {
			s = new BASE64Encoder().encode(data);
		}
		return s;
	}

	/**
	 * 解密
	 */
	public static String base64_decodeToUtf8(String s) {
		byte[] b = null;
		String result = null;
		if (s != null) {
			BASE64Decoder decoder = new BASE64Decoder();
			try {
				b = decoder.decodeBuffer(s);
				result = new String(b, "utf-8");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return result;
	}

	/**
	 * 解密
	 */
	public static byte[] base64_decodeToBinary(String s) {
		byte[] b = null;
		if (s != null) {
			BASE64Decoder decoder = new BASE64Decoder();
			try {
				b = decoder.decodeBuffer(s);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return b;
	}
}
