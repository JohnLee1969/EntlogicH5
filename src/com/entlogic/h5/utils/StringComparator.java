package com.entlogic.h5.utils;

import java.util.Comparator;

public class StringComparator implements Comparator<String> 
{
    public int compare(String str0, String str1) 
    {        
        return str0.compareTo(str1);
    }
}

