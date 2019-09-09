package com.entlogic.h5.utils;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Random;

import javax.imageio.ImageIO;

/**
 * 验证码生成类
 * 
 * @author John
 *
 */
public class CheckCode
{
	/**
	 * 生成数字验证码图片
	 * 
	 * @param lenght
	 * @return
	 * @throws Exception
	 */
	public static BufferedImage getCodeImage(String textCode) throws Exception
	{
		Random r = new Random();

		// 绘制图片背景
		int length = textCode.length();
		int width = length * 60;
		int height = 60;
		BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics g = image.getGraphics();
		g.setColor(Color.WHITE);
		g.fillRect(0, 0, width, height);

		// 绘制图片干扰线
		int x = r.nextInt(4), y = 0;
		int x1 = width - r.nextInt(4), y1 = 0;
		g.setColor(Color.BLACK);
		for (int i = 0; i < 3; i++)
		{
			y = r.nextInt(height - r.nextInt(4));
			y1 = r.nextInt(height - r.nextInt(4));
			g.drawLine(x, y, x1, y1);
		}

		// 写码
		int fsize = (int) (height * 0.6);// 字体大小为图片高度的80%
		int fx = 0;
		int fy = fsize;
		g.setFont(new Font(Font.SANS_SERIF, Font.PLAIN, fsize));
		for (int i = 0; i < textCode.length(); i++)
		{
			fy = (int) ((Math.random() * 0.3 + 0.6) * height); // 每个字符高低随机
			g.drawString(textCode.charAt(i) + "", fx, fy);
			fx += (width / textCode.length()) * (Math.random() * 0.3 + 0.8); // 依据宽度浮动
		}

		// 扭曲图片
		shearX(g, width, height, Color.WHITE);
		shearY(g, width, height, Color.WHITE);

		// 添加噪声点
		float yawpRate = 0.05f; // 噪声率
		int area = (int) (yawpRate * width * height);// 噪点数量
		for (int i = 0; i < area; i++)
		{
			int xxx = r.nextInt(width);
			int yyy = r.nextInt(height);
			image.setRGB(xxx, yyy, Color.GREEN.getRGB());
		}

		return image;
	}

	/**
	 *  扭曲横向
	 *  
	 * @param g
	 * @param w1
	 * @param h1
	 * @param color
	 */
	private static void shearX(Graphics g, int w1, int h1, Color color)
	{
		Random random = new Random();
		int period = 2;

		boolean borderGap = true;
		int frames = 1;
		int phase = random.nextInt(2);

		for (int i = 0; i < h1; i++)
		{
			double d = (double) (period >> 1) * Math.sin((double) i / (double) period + (2.2831853071795862D * (double) phase) / (double) frames);
			g.copyArea(0, i, w1, 1, (int) d, 0);
			if (borderGap)
			{
				g.setColor(color);
				g.drawLine((int) d, i, 0, i);
				g.drawLine((int) d + w1, i, w1, i);
			}
		}

	}

	/**
	 * 扭曲纵向
	 * 
	 * @param g
	 * @param w1
	 * @param h1
	 * @param color
	 */
	private static void shearY(Graphics g, int w1, int h1, Color color)
	{
		Random random = new Random();
		int period = random.nextInt(40) + 10; // 50;

		boolean borderGap = true;
		int frames = 20;
		int phase = random.nextInt(2);
		for (int i = 0; i < w1; i++)
		{
			double d = (double) (period >> 1) * Math.sin((double) i / (double) period + (2.2831853071795862D * (double) phase) / (double) frames);
			g.copyArea(i, 0, 1, h1, 0, (int) d);
			if (borderGap)
			{
				g.setColor(color);
				g.drawLine(i, (int) d, i, 0);
				g.drawLine(i, (int) d + h1, i, h1);
			}

		}
	}
	
	/**
	 * 测试程序
	 * @param args
	 */
	public static void main(String args[])
	{
		try
		{
			BufferedImage img = CheckCode.getCodeImage("1234");
			ImageIO.write(img, "JPEG", new File("D:/test.jpg"));
		}
		catch(Exception e)
		{
			
		}
	}
}
