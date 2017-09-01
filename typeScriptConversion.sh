echo "converting ts to js"

cd ./node_modules/@restorecommerce/srv-client/
tsc -d
cd ../../../

echo 'tsc -d for service client completed successfully';
