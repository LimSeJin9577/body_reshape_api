cd "$3"/app/library/body_reshape
python3 inference.py --mode "$1" --degree $2
cd "$3"