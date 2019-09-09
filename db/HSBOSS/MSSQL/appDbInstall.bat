sqlcmd -S 127.0.0.1,1449 -U sa -P ofidc123.com -d master -f 65001 -i createDB.sql
PAUSE
sqlcmd  -S 127.0.0.1,1449 -U sa -P ofidc123.com -d HSBOSS -f 65001 -i initDB.sql
PAUSE