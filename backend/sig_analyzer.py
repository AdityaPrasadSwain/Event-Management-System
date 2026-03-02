import re
import os

def analyze_file(path):
    if not os.path.exists(path): return
    print(f"\nAnalyzing: {path}")
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Simple method indicator: contains '(' and ends with '{' or has matching ')' and '{'
    sigs = {}
    for i, line in enumerate(lines):
        line = line.strip()
        if '(' in line and (line.endswith('{') or line.endswith(') {') or '{' in line):
            # Extract method name and params
            # We look for words before (
            match = re.search(r'(\w+)\s*\(', line)
            if match:
                name = match.group(1)
                # Ignore java keywords
                if name in ['if', 'while', 'for', 'switch', 'catch', 'synchronized']: continue
                
                # Extract params (this is rough)
                params_match = re.search(r'\((.*?)\)', line)
                if params_match:
                    params = params_match.group(1)
                    # Normalize: just count types or something
                    sig = f"{name}({params})"
                    if sig in sigs:
                        sigs[sig].append(i + 1)
                    else:
                        sigs[sig] = [i + 1]
    
    found = False
    for sig, line_nums in sigs.items():
        if len(line_nums) > 1:
            print(f"DUPLICATE FOUND: {sig} at lines {line_nums}")
            found = True
    if not found:
        print("No duplicates found with this method.")

analyze_file(r"c:\Users\swain\OneDrive\Desktop\Event Management System\backend\src\main\java\com\sems\service\impl\RevenueServiceImpl.java")
analyze_file(r"c:\Users\swain\OneDrive\Desktop\Event Management System\backend\src\main\java\com\sems\service\impl\UserServiceImpl.java")
analyze_file(r"c:\Users\swain\OneDrive\Desktop\Event Management System\backend\src\main\java\com\sems\service\impl\BookingServiceImpl.java")
