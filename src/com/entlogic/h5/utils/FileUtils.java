package com.entlogic.h5.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Date;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class FileUtils
{
	public static boolean isValidUploadingFile(String fileName)
	{
		String fileTypes = ".JPG/.PNG/.PDF/.DOC/.DOCX/.XLS/XLSX/.LNK/.JS/.CSS";
		String fileExt = fileName.toUpperCase();
		while (fileExt.indexOf(".") > 0)
		{
			fileExt = fileExt.substring(fileExt.indexOf("."));
		}
		
		return fileTypes.indexOf(fileExt) >= 0;
	}
	
	public static void deleteFile(File file)
	{
		if (file.exists())
		{
			if (file.isDirectory())
			{
				File files[] = file.listFiles();
				for (int i = 0; i < files.length; i++)
				{
					deleteFile(files[i]);
				}
			}
			file.delete();
		}
	}
	
	public static void clearDirectory(File file)
	{
		if (file.exists())
		{
			if (file.isDirectory())
			{
				File files[] = file.listFiles();
				for (int i = 0; i < files.length; i++)
				{
					deleteFile(files[i]);
				}
			}
		}
	}
	
	public static void clearDirectory(String path)
	{
		File file = new File(path);
		if (file.exists())
		{
			if (file.isDirectory())
			{
				File files[] = file.listFiles();
				for (int i = 0; i < files.length; i++)
				{
					deleteFile(files[i]);
				}
			}
		}
	}
	
	public static String getFileExt(String fileName)
	{
		return fileName.substring(fileName.lastIndexOf(".") + 1);
	}
	
	public static long copy(String sourcePath, String targetPath) throws Exception
	{
		File f1 = new File(sourcePath);
		File f2 = new File(targetPath);
		
		if (!f2.exists())
		{
			f2.createNewFile();
		}
		
		long time = new Date().getTime();
		int length = 2097152;
		FileInputStream in = new FileInputStream(f1);
		FileOutputStream out = new FileOutputStream(f2);
		byte[] buffer = new byte[length];
		while (true)
		{
			int ins = in.read(buffer);
			if (ins == -1)
			{
				break;
			}
			out.write(buffer, 0, ins);
		}
		in.close();
		out.flush();
		out.close();
		
		return new Date().getTime() - time;
	}
	
	public static void copyDir(String sourcePath, String targetPath) throws Exception
	{
		File file = new File(sourcePath);
		String[] filePath = file.list();
		
		if (!(new File(targetPath)).exists())
		{
			(new File(targetPath)).mkdir();
		}
		
		for (int i = 0; i < filePath.length; i++)
		{
			if ((new File(sourcePath + File.separator + filePath[i])).isDirectory())
			{
				copyDir(sourcePath + File.separator + filePath[i], targetPath + File.separator + filePath[i]);
			}
			
			if (new File(sourcePath + File.separator + filePath[i]).isFile())
			{
				copy(sourcePath + File.separator + filePath[i], targetPath + File.separator + filePath[i]);
			}
			
		}
	}
	
	/**
	 * 将文件读进二进制数组
	 * 
	 * @param filePath
	 * @return
	 * @throws IOException
	 */
	public static byte[] readToByteArray(String filePath) throws IOException
	{
		File file = new File(filePath);
		long fileSize = file.length();
		if (fileSize > Integer.MAX_VALUE) { throw new IOException("File is too big." + file.getName()); }
		FileInputStream fi = new FileInputStream(file);
		byte[] buffer = new byte[(int) fileSize];
		int offset = 0;
		int numRead = 0;
		while (offset < buffer.length && (numRead = fi.read(buffer, offset, buffer.length - offset)) >= 0)
		{
			offset += numRead;
		}
		// 确保所有数据均被读取
		if (offset != buffer.length)
		{
			fi.close();
			throw new IOException("Could not completely read file " + file.getName());
		}
		fi.close();
		return buffer;
	}
	
	public static String readToString(String path)
	{
		BufferedReader br = null; 
		
		try
		{
			FileInputStream fis = new FileInputStream(path);
			InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
			br = new BufferedReader(isr);
			
			String line = null;
			String result = "";
			while ((line = br.readLine()) != null)
			{
				result += line;
				result += "\r\n"; // 补上换行符
			}
			br.close();
			
			return result.toString();
		}
		catch (Exception e)
		{			
			e.printStackTrace();
			return null;
		}
	}
	
	public static void writeToFile(String text, String path)
	{
		try
		{
			FileOutputStream fos = new FileOutputStream(path);
			OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
			osw.write(text);
			osw.flush();
			osw.close();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	/**
	 * 
	 * @param zipFileName
	 * @param inputFile
	 * @throws Exception
	 */
	public static void zip(String zipFileName, File inputFile) throws Exception
	{
		System.out.println("压缩中...");
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFileName));
		BufferedOutputStream bo = new BufferedOutputStream(out);
		zip(out, inputFile, inputFile.getName(), bo);
		bo.close();
		out.close(); // 输出流关闭
		System.out.println("压缩完成");
	}
	
	/**
	 * 
	 * @param out
	 * @param f
	 * @param base
	 * @param bo
	 * @throws Exception
	 */
	public static void zip(ZipOutputStream out, File f, String base, BufferedOutputStream bo) throws Exception
	{
		if (f.isDirectory())
		{
			File[] fl = f.listFiles();
			if (fl.length == 0)
			{
				out.putNextEntry(new ZipEntry(base + "/")); // 创建zip压缩进入点base
				System.out.println(base + "/");
			}
			for (int i = 0; i < fl.length; i++)
			{
				zip(out, fl[i], base + "/" + fl[i].getName(), bo); // 递归遍历子文件夹
			}
		}
		else
		{
			out.putNextEntry(new ZipEntry(base)); // 创建zip压缩进入点base
			System.out.println(base);
			FileInputStream in = new FileInputStream(f);
			BufferedInputStream bi = new BufferedInputStream(in);
			int b;
			while ((b = bi.read()) != -1)
			{
				bo.write(b); // 将字节流写入当前zip目录
			}
			bi.close();
			in.close(); // 输入流关闭
		}
	}
	
	public static void unZip(String zipFilePath, String unZipTo) throws Exception
	{
		// 输入源zip路径
		ZipInputStream Zin = new ZipInputStream(new FileInputStream(zipFilePath));
		BufferedInputStream Bin = new BufferedInputStream(Zin);
		
		// 输出路径（文件夹目录）
		String Parent = unZipTo;
		File Fout = null;
		ZipEntry entry;
		try
		{
			while ((entry = Zin.getNextEntry()) != null && !entry.isDirectory())
			{
				Fout = new File(Parent, entry.getName());
				if (!Fout.exists())
				{
					(new File(Fout.getParent())).mkdirs();
				}
				FileOutputStream out = new FileOutputStream(Fout);
				BufferedOutputStream Bout = new BufferedOutputStream(out);
				int b;
				while ((b = Bin.read()) != -1)
				{
					Bout.write(b);
				}
				Bout.close();
				out.close();
			}
			Bin.close();
			Zin.close();
		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
