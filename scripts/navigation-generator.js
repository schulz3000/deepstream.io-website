/************************************
 * Navigation Generator
 ***********************************/
var sort = function( nav ) {
	var ordered = [];
	var order = Object.keys( nav ).sort();
	for( var i=0; i<order.length;i++) {
		if( order[ i ] === 'undefined' ) continue;

		if( !nav[ order[ i ] ].title ) {
			ordered.push( {
				name: order[ i ],
				children: sort( nav[ order[ i ] ] )
			} );
		} else {
			ordered.push( nav[ order[ i ] ] );
		}
	}
	return ordered;
};

module.exports = function() {
	return function( files, metalsmith, done ) {
		var metadata = metalsmith.metadata();
		metadata.nav = {};

		var fileParts;
		var filePath;
		var file;
		for( filePath in files ) {

			file = files[ filePath ];

			file.type = {
				install : file.level1 === 'install',
				tutorials : file.level1 === 'tutorials',
				docs : file.level1 === 'docs',
				blog : file.level1 === 'blog',
				info : file.level1 === 'info'
			}

			if( !metadata.nav[ file.level1 ] ) {
				metadata.nav[ file.level1 ] = {};
			}

			if( file.isLevel2 && !file.isLevel3 ) {
				if( file.type.install || file.type.blog ) {
					metadata.nav[ file.level1 ][ file.level2 ] = {
						title: file.title || file.level2,
						description: file.description || 'TODO: Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..',
						path: `${file.level1}/${file.level2}/${file.level2}.html`,
						indexPath: `${file.level1}/${file.level2}/`
					};
				}
			}
			else if( file.isLevel2 || file.isLevel3 ) {
				if( !metadata.nav[ file.level1 ][ file.level2 ] ) {
					metadata.nav[ file.level1 ][ file.level2 ] = {};
				}
			}

			if( file.isLevel3 ) {
				metadata.nav[ file.level1 ][ file.level2 ][ file.level3 ] = {
					title: file.title || file.level3,
					description: file.description || 'TODO: Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..',
					path: `${file.level1}/${file.level2}/${file.level3}/${file.level3}.html`,
					indexPath: `${file.level1}/${file.level2}/${file.level3}/`
				};
			}
		}

		for( var level1 in metadata.nav ) {
			metadata.nav[ level1 ] = sort( metadata.nav[ level1 ] );
		}

		for( filePath in files ) {
			files[ filePath ].tree = metadata.nav[ files[ filePath ].level1 ];
			files[ filePath ].tree_level_2 = files[ filePath ].tree.find( function( file, element ) {
				return file.level2 === element.name;
			}.bind( null, files[ filePath ] ) );
		}

		done();
	}
}
