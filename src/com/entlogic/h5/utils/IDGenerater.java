package com.entlogic.h5.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
//import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

/**
 * 常用的编码生成器
 * 
 * @author John
 * 
 */
public class IDGenerater
{
	/**
	 * 生成UUID
	 * 
	 * @return
	 * @throws Exception
	 */
	public static String UUID() throws Exception
	{
		return java.util.UUID.randomUUID().toString().replace("-", "");
	}
	
	/**
	 * 生成二维码
	 * @param text
	 * @param width
	 * @param height
	 * @param filePath
	 * @throws WriterException
	 * @throws IOException
	 */
	private static void generateQRCodeImage(String text, int width, int height, String filePath) throws WriterException, IOException
	{
		QRCodeWriter qrCodeWriter = new QRCodeWriter();
		
		BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
		
		Path path = FileSystems.getDefault().getPath(filePath);
		
		//MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
		
	}
	
	public static void main(String[] args)
	{
		try
		{
			generateQRCodeImage("This is my first QR Code", 350, 350, "");
		}
		catch (WriterException e)
		{
			System.out.println("Could not generate QR Code, WriterException :: " + e.getMessage());
		}
		catch (IOException e)
		{
			System.out.println("Could not generate QR Code, IOException :: " + e.getMessage());
		}
		
	}
}
