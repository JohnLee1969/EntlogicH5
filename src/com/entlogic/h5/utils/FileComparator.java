package com.entlogic.h5.utils;

import java.io.File;
import java.util.Comparator;

public class FileComparator implements Comparator<File> 
{
    public int compare(File f0, File f1) 
    {       
        return f0.getName().compareTo(f1.getName());
    }
}

