#!/usr/bin/env node

/**********************************
* @file: ypcopy
* @desc: a node copy cli
* @author: yp
* @version: 1.0.0
* @date: 2019-10-13 / 2019-10-13
***********************************/

const fs = require( "fs" );
const chalk = require("chalk");
const argv = process.argv;

/**
 *  copy main function
 *
 * @param  {String} from which file or directory you wanna copy
 * @param  {String} to   the target file or dir you copyed
 */
async function ypcopy(from, to) {
	if(!from){
		console.log(error("pleace input the file or directory you wanna copy"));
		return ;
	}
	try{
		if(from === "--help"){
			help();
			return;
		}
		await isExist(from);
		if(!to){
			console.log(error("pleace  the target file or directory you wanna copy"));
			return;
		}
		const type = await pathType(argv[2]);
		if(type == "file"){
			copyFile(from ,to); // file copy
		}else{
			copyDir(from,to); // directory copy
		}
	}catch(err){
		console.log(error(err));
	}
}

// execute ypcopy
ypcopy(argv[2],argv[3]);

/**
 * copy file
 *
 * @param  {String} from copied file
 * @param  {String} to   target file
 */
function copyFile(from, to) {
	fs.writeFileSync(to, fs.readFileSync(from));
	console.log(success(from,to));
}

/**
 * copy directory
 *
 * @param  {String} from
 * @param  {String} to
 */
async function copyDir(from, to) {
	console.log(chalk.magenta(`🏇 copy ${from} `));
	try{
		await isExist(to);
	}catch(err){
		fs.mkdirSync(to);
	}
	await fs.readdir(from, (err, paths) => {
		paths.forEach((path)=>{
			var src = `${from}/${path}`;
			var dist = `${to}/${path}`;
			fs.stat(src,(err, stat)=> {
				if(stat.isFile()) {
					fs.writeFileSync(dist, fs.readFileSync(src));
					console.log(chalk.magenta(`🏇 copy ${src} `));
				} else if(stat.isDirectory()) {
					copyDir(src, dist);
				}
			});
		});
	});
}

/**
 * is exists
 *
 * @param  {String} file
 * @return {Promise}
 */
function isExist(path){
	return new Promise((resolve,reject)=>{
		fs.access(path,  (err) => {
			if(err!==null){
				reject(`${path} does not exist`);
			}else{
				resolve(true);
			}
		});
	});
}

/**
 * file or a folder
 *
 * @param  {String} path
 * @return {Promise}
 */
function pathType(path){
	return new Promise((resolve,reject)=>{
		fs.stat(path,(err,stats)=>{
			if(err === null){
				if(stats.isDirectory()){
					resolve("dir"); // it's directory
				}else if(stats.isFile()){
					resolve("file"); // it's file
				}
			}else{
				reject(error(path)); // files or directory don't exist
			}
		});
	});
}

/**
 * help output
 *
 * @return {String}  help description
 */
function help(){
	console.log(chalk.blueBright(`
ypcopy: 0.08
options:
[from] [to]       copy [from] file or directory to [to]
example:
ypcopy a.js b.js   copy a.js to b.js
ypcopy dirA dirB   copy directory dirA to dirB
		`));
}

/**
 * error output
 *
 * @param  {String} path
 * @return {String}
 */
function error(msg){
	return chalk.red(`
⛑ ⛑ ⛑
error: ${msg}
Use --help to display the cli options.
  `);
}

/**
 * success output
 *
 * @param  {String} path
 * @return {String}
 */
function success(from,to){
	return chalk.green(`
******************************************
*
* 💯
*
* ok: ${from} copy to ${to} success
*
******************************************
  `);
}
