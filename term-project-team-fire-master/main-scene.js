// Mingchao Lai, Justin Han, I-Lin Wu

// 104941619, 104565037, 804951681

window.Cube2 = window.classes.Cube2 =
  class Cube2 extends Shape                 // Here's a complete, working example of a Shape subclass.  It is a blueprint for a cube.
  {
    constructor() {
      super("positions", "normals"); // Name the values we'll define per each vertex.  They'll have positions and normals.

      // First, specify the vertex positions -- just a bunch of points that exist at the corners of an imaginary cube.
      this.positions.push(...Vec.cast([-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [0.8, 1, -0.8], [-0.8, 1, -0.8], [0.8, 1, 0.8], [-0.8, 1, 0.8],
        [-1, -1, -1], [-1, -1, 1], [-0.8, 1, -0.8], [-0.8, 1, 0.8], [1, -1, 1], [1, -1, -1], [0.8, 1, 0.8], [0.8, 1, -0.8],
        [-1, -1, 1], [1, -1, 1], [-0.8, 1, 0.8], [0.8, 1, 0.8], [1, -1, -1], [-1, -1, -1], [0.8, 1, -0.8], [-0.8, 1, -0.8]));
      // Supply vectors that point away from eace face of the cube.  They should match up with the points in the above list
      // Normal vectors are needed so the graphics engine can know if the shape is pointed at light or not, and color it accordingly.
      this.normals.push(...Vec.cast([0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [-1, 0, 0], [-1, 0, 0],
        [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1],
        [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]));

      // Those two lists, positions and normals, fully describe the "vertices".  What's the "i"th vertex?  Simply the combined
      // data you get if you look up index "i" of both lists above -- a position and a normal vector, together.  Now let's
      // tell it how to connect vertex entries into triangles.  Every three indices in this list makes one triangle:
      this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
        14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
      // It stinks to manage arrays this big.  Later we'll show code that generates these same cube vertices more automatically.
    }
  }




//this loading class is adapted online from github: https://github.com/frenchtoast747/webgl-obj-loader/blob/gh-pages/webgl-obj-loader.js
window.load_obj = window.classes.load_obj =
  class load_obj extends Shape {
    constructor(filename) {
      super("positions", "normals", "texture_coords");

      this.load_file(filename);

    }


    load_file(filename) {
      return fetch(filename)

        .then(response => {
          return Promise.resolve(response.text())
        })

        .then(object_info => this.mesh_info(object_info))
    }

    mesh_info(objectData) {

      var verts = [], vertNormals = [], textures = [], unpacked = {};

      // unpacking stuff

      unpacked.verts = [];

      unpacked.norms = [];

      unpacked.textures = [];

      unpacked.hashindices = {};

      unpacked.indices = [];

      unpacked.index = 0;

      var lines = objectData.split('\n');
      var VERTEX_RE = /^v\s/; var NORMAL_RE = /^vn\s/; var TEXTURE_RE = /^vt\s/;
      var FACE_RE = /^f\s/; var WHITESPACE_RE = /\s+/;

      for (var i = 0; i < lines.length; i++) {

        var line = lines[i].trim();

        var elements = line.split(WHITESPACE_RE);

        elements.shift();

        if (VERTEX_RE.test(line)) {

          verts.push.apply(verts, elements);

        } else if (NORMAL_RE.test(line)) {

          vertNormals.push.apply(vertNormals, elements);

        } else if (TEXTURE_RE.test(line)) {

          textures.push.apply(textures, elements);

        } else if (FACE_RE.test(line)) {

          var quad = false;

          for (var j = 0, eleLen = elements.length; j < eleLen; j++) {


            if (j === 3 && !quad) {
              j = 2;
              quad = true;
            }

            if (elements[j] in unpacked.hashindices) {

              unpacked.indices.push(unpacked.hashindices[elements[j]]);

            }

            else {
              var vertex = elements[j].split('/');


              // vertex position

              unpacked.verts.push(verts[(vertex[0] - 1) * 3 + 0]);

              unpacked.verts.push(verts[(vertex[0] - 1) * 3 + 1]);

              unpacked.verts.push(verts[(vertex[0] - 1) * 3 + 2]);

              // vertex textures

              unpacked.textures.push(textures[(vertex[1] - 1) * 2 + 0]);

              unpacked.textures.push(textures[(vertex[1] - 1) * 2 + 1]);

              // vertex normals

              unpacked.norms.push(vertNormals[(vertex[2] - 1) * 3 + 0]);

              unpacked.norms.push(vertNormals[(vertex[2] - 1) * 3 + 1]);

              unpacked.norms.push(vertNormals[(vertex[2] - 1) * 3 + 2]);

              // add the newly created vertex to the list of indices

              unpacked.hashindices[elements[j]] = unpacked.index;

              unpacked.indices.push(unpacked.index);

              // increment the counter

              unpacked.index += 1;

            }
            if (j === 3 && quad) unpacked.indices.push(unpacked.hashindices[elements[0]]);
          }
        }
      }

      for (var j = 0; j < unpacked.verts.length / 3; j++) {

        this.positions.push(Vec.of(unpacked.verts[3 * j], unpacked.verts[3 * j + 1], unpacked.verts[3 * j + 2]));

        this.normals.push(Vec.of(unpacked.norms[3 * j], unpacked.norms[3 * j + 1], unpacked.norms[3 * j + 2]));

        this.texture_coords.push(Vec.of(unpacked.textures[2 * j], unpacked.textures[2 * j + 1]));

      }

      this.vertices = unpacked.verts;

      this.vertexNormals = unpacked.norms;

      this.textures = unpacked.textures;

      this.indices = unpacked.indices;

      this.copy_onto_graphics_card(this.gl);
      this.ready = true;
    }

  }

// from dependencies.js 
window.tetrahedron = window.classes.tetrahedron =
  class tetrahedron extends Shape {
    constructor() {
      super("positions", "normals", "texture_coords");
      var a = 1 / Math.sqrt(3);
      this.positions.push(...Vec.cast([-Math.sqrt(3) / 4.0, 0, 1], [Math.sqrt(3) / 4.0, 0, 1], [0, 1, 0.8], [0, 0, Math.sqrt(3) / 4.0]));
      this.normals.push(...Vec.cast([-a, -a, -a], [1, 0, 0], [0, 1, 0], [0, 0, 1]));
      this.texture_coords.push(...Vec.cast([0, 0], [1, 0], [0, 1,], [1, 1]));
      this.indices.push(0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3);
    }
  }




window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
  class Assignment_Three_Scene extends Scene_Component {
    constructor(context, control_box)     // The scene begins by requesting the camera, shapes, and materials it will need.
    {
      super(context, control_box);    // First, include a secondary Scene that provides movement controls:
      if (!context.globals.has_controls)
        context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

      context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 50, 120), Vec.of(0, 20, 0), Vec.of(0, 1, 0)); //(eye_vector(position of eye point (far or near)), center_vector, up_vector)
      this.initial_camera_location = Mat4.inverse(context.globals.graphics_state.camera_transform); //assign the value of camera location to an variable

      const r = context.width / context.height; //(percpective transform parameter)
      context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000); //(projection transform)

      const shapes = {
        rect: new Square(),
        tri: new tetrahedron(),
        box: new Cube(),
        sphere: new Subdivision_Sphere(4),
        test_model: new load_obj("assets/cigi.obj"),
        trapezoid: new Cube2(),
        fire_ball: new Subdivision_Sphere(2),



      }
      this.submit_shapes(context, shapes);

      // Make some Material objects available to you:
      this.materials =
        {
          phong: context.get_instance(Phong_Shader).material(Color.of(0, 191/255, 255/255, 1), { ambient: 1}, { diffusivity: 0 }, { specularity: 1 }, { smoothness: 1 }),
          phong_text: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), { ambient: 1, texture: context.get_instance("assets/TT_Cliff.jpg", false) }),
          ground_material: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), { ambient: 1, texture: context.get_instance("assets/TT_Cliff.jpg", false) }),
          sky_material: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), { ambient: 1, texture: context.get_instance("assets/sky.jpg", false) }),
          tree_material: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), { ambient: 1, texture: context.get_instance("assets/TT_Green Grass.BMP", false) }),
          fire_material: context.get_instance(fire_Shader).material(Color.of(0, 0, 0, 1), { ambient: 1, texture: context.get_instance("assets/flame.png", false) }, { diffusivity: 0 }, { specularity: 1 }, { smoothness: 1 }),
          smoke_material: context.get_instance(Smoke_Shader).material(Color.of(0, 0, 0, 1), { ambient: 1, texture: context.get_instance("assets/explosion.png", false) }, { diffusivity: 0 }, { specularity: 1 }, { smoothness: 1 }),


        }

      this.lights = [new Light(Vec.of(0, 20, 0, 0.1), Color.of(1, 1, 0, 1), 10000)];

      this.final_position;
      this.flag = 1;
      this.fire_particle_array = [];
      this.smoke_particle_array = [];
      this.water_particle_array = [];
      this.helicopter_position = Mat4.identity().times(Mat4.translation([80, 40, 8]));
      this.leaf_position = Mat4.identity().times(Mat4.translation([-10, 10, 0]));
      this.start_fire = 0;
      this.helicopter_flag = 0;
      this.fire_touched_water_flag = 0;
      this.origin_camera_position = context.globals.graphics_state.camera_transform;
      this.count = 0;
      this.test_position = Mat4.identity().times(Mat4.translation([0, 50, 50]));
      this.start_wind_left = 0;
      this.start_wind_right = 0;
      this.helicopter_flag2 = 0;
      this.drop_water_flag = 0;
    }

    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    {
      this.key_triggered_button("View solar system", ["0"], () => this.attached = () => this.initial_camera_location);
      this.new_line();
      this.key_triggered_button("Start Fire", ["1"], () => {

        if (this.start_fire == 0) {
          this.start_fire = 1;
        }
        else {
          this.start_fire = 0;
        }
      });

      this.key_triggered_button("Send Helicopter", ["2"], () => {

        if (this.helicopter_flag == 0) {
          this.helicopter_flag = 1;
          this.start_fire = 0;
        }
        else {
          this.helicopter_flag = 0;
        }
      });

      this.key_triggered_button("Send Helicopter away", ["3"], () => {

        if (this.helicopter_flag2 == 0) {
          this.helicopter_flag2 = 1;
        }
        else {
          this.helicopter_flag2 = 0;
        }
      });

      this.key_triggered_button("Start Wind from the left", ["4"], () => {

        if (this.start_wind_left == 0) {
          this.start_wind_left = 1;
        }
        else {
          this.start_wind_left = 0;
        }
      });

      this.key_triggered_button("Start Wind from the right", ["5"], () => {

        if (this.start_wind_right == 0) {
          this.start_wind_right = 1;
        }
        else {
          this.start_wind_right = 0;
        }
      });

      this.key_triggered_button("Drop water", ["6"], () => {
          if (this.drop_water_flag == 0) {
              this.drop_water_flag = 1;
          } else {
              this.drop_water_flag = 0;
          }
      });



    }



    draw_trees(graphics_state, position) {
      let square_position = position;
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([15, 15, 15])).times(Mat4.translation([0, 0.8, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([13, 13, 13])).times(Mat4.translation([0, 1.3, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([10, 10, 10])).times(Mat4.translation([0, 2.2, -0.8])), this.materials.tree_material);
      square_position = square_position.times(Mat4.scale([1, 1, 1])).times(Mat4.translation([0, 1, 0]));
      this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      for (var i = 0; i < 6; i++) {
        square_position = square_position.times(Mat4.translation([0, 2, 0]));
        this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      }
    }

    draw_trees_with_fire(graphics_state, position) {
      let square_position = position;
      let fire_position = position.times(Mat4.translation([0, 13, 3]));
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([15, 15, 15])).times(Mat4.translation([0, 0.8, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([13, 13, 13])).times(Mat4.translation([0, 1.3, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([10, 10, 10])).times(Mat4.translation([0, 2.2, -0.8])), this.materials.tree_material);
      square_position = square_position.times(Mat4.scale([1, 1, 1])).times(Mat4.translation([0, 1, 0]));
      this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      for (var i = 0; i < 6; i++) {
        square_position = square_position.times(Mat4.translation([0, 2, 0]));
        this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      }

      this.draw_fire_particle_system(graphics_state, fire_position.times(Mat4.scale([2, 2, 0.1])));
    }

    draw_trees_with_fire_left(graphics_state, position) {
      let square_position = position;
      let fire_position = position.times(Mat4.translation([0, 13, 3]));
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([15, 15, 15])).times(Mat4.translation([0, 0.8, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([13, 13, 13])).times(Mat4.translation([0, 1.3, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([10, 10, 10])).times(Mat4.translation([0, 2.2, -0.8])), this.materials.tree_material);
      square_position = square_position.times(Mat4.scale([1, 1, 1])).times(Mat4.translation([0, 1, 0]));
      this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      for (var i = 0; i < 6; i++) {
        square_position = square_position.times(Mat4.translation([0, 2, 0]));
        this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      }

      this.draw_fire_left_particle_system(graphics_state, fire_position.times(Mat4.scale([2, 2, 0.1])));
    }

    draw_trees_with_fire_right(graphics_state, position) {
      let square_position = position;
      let fire_position = position.times(Mat4.translation([0, 13, 3]));
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([15, 15, 15])).times(Mat4.translation([0, 0.8, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([13, 13, 13])).times(Mat4.translation([0, 1.3, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([10, 10, 10])).times(Mat4.translation([0, 2.2, -0.8])), this.materials.tree_material);
      square_position = square_position.times(Mat4.scale([1, 1, 1])).times(Mat4.translation([0, 1, 0]));
      this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      for (var i = 0; i < 6; i++) {
        square_position = square_position.times(Mat4.translation([0, 2, 0]));
        this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      }

      this.draw_fire_right_particle_system(graphics_state, fire_position.times(Mat4.scale([2, 2, 0.1])));
    }

    draw_trees_with_smoke(graphics_state, position) {
      let square_position = position;
      let fire_position = position.times(Mat4.translation([0, 13, 3]));
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([15, 15, 15])).times(Mat4.translation([0, 0.8, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([13, 13, 13])).times(Mat4.translation([0, 1.3, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([10, 10, 10])).times(Mat4.translation([0, 2.2, -0.8])), this.materials.tree_material);
      square_position = square_position.times(Mat4.scale([1, 1, 1])).times(Mat4.translation([0, 1, 0]));
      this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      for (var i = 0; i < 6; i++) {
        square_position = square_position.times(Mat4.translation([0, 2, 0]));
        this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      }

      this.draw_smoke_particle_system(graphics_state, fire_position)
    }

    draw_trees_with_smoke_left(graphics_state, position) {
      let square_position = position;
      let fire_position = position.times(Mat4.translation([0, 13, 3]));
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([15, 15, 15])).times(Mat4.translation([0, 0.8, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([13, 13, 13])).times(Mat4.translation([0, 1.3, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([10, 10, 10])).times(Mat4.translation([0, 2.2, -0.8])), this.materials.tree_material);
      square_position = square_position.times(Mat4.scale([1, 1, 1])).times(Mat4.translation([0, 1, 0]));
      this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      for (var i = 0; i < 6; i++) {
        square_position = square_position.times(Mat4.translation([0, 2, 0]));
        this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      }

      this.draw_smoke_left_particle_system(graphics_state, fire_position)
    }

    draw_trees_with_smoke_right(graphics_state, position) {
      let square_position = position;
      let fire_position = position.times(Mat4.translation([0, 13, 3]));
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([15, 15, 15])).times(Mat4.translation([0, 0.8, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([13, 13, 13])).times(Mat4.translation([0, 1.3, -0.8])), this.materials.tree_material);
      this.shapes.tri.draw(graphics_state, square_position.times(Mat4.scale([10, 10, 10])).times(Mat4.translation([0, 2.2, -0.8])), this.materials.tree_material);
      square_position = square_position.times(Mat4.scale([1, 1, 1])).times(Mat4.translation([0, 1, 0]));
      this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      for (var i = 0; i < 6; i++) {
        square_position = square_position.times(Mat4.translation([0, 2, 0]));
        this.shapes.box.draw(graphics_state, square_position, this.materials.tree_material);
      }

      this.draw_smoke_right_particle_system(graphics_state, fire_position)
    }

    draw_helicopter(graphics_state, position) {
      const dt = graphics_state.animation_delta_time / 1000;
      const t = graphics_state.animation_time / 1000;
      let box1_position;
      let box2_position;
      let body_position;
      let feet1_position;
      let feet2_position;
      let feet3_position;
      let feet4_position;
      let support1_position;
      let support2_position;
      let tail_position;
      let tailfan1_position;
      let tailfan2_position;
      box1_position = position.times(Mat4.rotation(4 * t, Vec.of(0, 1, 0))).times(Mat4.scale([8, 0.1, 0.3,])).times(Mat4.translation([0, 76, 0]));
      box2_position = position.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 1, 0))).times(Mat4.rotation(4 * t, Vec.of(0, 1, 0))).times(Mat4.scale([8, 0.1, 0.3,])).times(Mat4.translation([0, 76, 0]));
      body_position = position.times(Mat4.scale([5, 3, 2])).times(Mat4.translation([0, 1.5, 0]));
      feet1_position = position.times(Mat4.scale([0.2, 0.7, 0.2])).times(Mat4.translation([-7, 1.8, 3]));
      feet2_position = position.times(Mat4.scale([0.2, 0.7, 0.2])).times(Mat4.translation([-7, 1.8, -3]));
      feet3_position = position.times(Mat4.scale([0.2, 0.7, 0.2])).times(Mat4.translation([7, 1.8, 3]));
      feet4_position = position.times(Mat4.scale([0.2, 0.7, 0.2])).times(Mat4.translation([7, 1.8, -3]));
      support1_position = position.times(Mat4.scale([2.8, 0.1, 0.3])).times(Mat4.translation([0, 5, 2]));
      support2_position = position.times(Mat4.scale([2.8, 0.1, 0.3])).times(Mat4.translation([0, 5, -2]));
      tail_position = position.times(Mat4.rotation(-Math.PI / 2, Vec.of(0, 0, 1))).times(Mat4.scale([0.5, 2.5, 0.3])).times(Mat4.translation([-8, 2.8, 0]));
      tailfan1_position = position.times(Mat4.translation([9.5, 4, 0])).times(Mat4.rotation(4 * t, Vec.of(1, 0, 0))).times(Mat4.scale([0.08, 2, 0.3]));
      tailfan2_position = position.times(Mat4.translation([9.5, 4, 0])).times(Mat4.rotation(4 * t, Vec.of(1, 0, 0))).times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0))).times(Mat4.scale([0.08, 2, 0.3]));
      this.shapes.box.draw(graphics_state, box1_position, this.materials.phong);
      this.shapes.box.draw(graphics_state, box2_position, this.materials.phong);
      this.shapes.sphere.draw(graphics_state, body_position, this.materials.phong);
      this.shapes.box.draw(graphics_state, feet1_position, this.materials.phong);
      this.shapes.box.draw(graphics_state, feet2_position, this.materials.phong);
      this.shapes.box.draw(graphics_state, feet3_position, this.materials.phong);
      this.shapes.box.draw(graphics_state, feet4_position, this.materials.phong);
      this.shapes.box.draw(graphics_state, support1_position, this.materials.phong);
      this.shapes.box.draw(graphics_state, support2_position, this.materials.phong);
      this.shapes.trapezoid.draw(graphics_state, tail_position, this.materials.phong);
      this.shapes.box.draw(graphics_state, tailfan1_position, this.materials.phong);
      this.shapes.box.draw(graphics_state, tailfan2_position, this.materials.phong);
    }

    //create a particles array to keep adding and deleteing particles to simulate fire effect
    draw_fire_particle_system(graphics_state, position) {
      let p = new particle_class(position);
      this.fire_particle_array.push(p);
      // console.log(this.particle_array);
      for (var i = this.fire_particle_array.length - 1; i > 0; i--) {
        this.shapes.sphere.draw(graphics_state, this.fire_particle_array[i].position, this.materials.fire_material);
        this.fire_particle_array[i].update();
        if (this.fire_particle_array[i].delete_particles()) {
          this.fire_particle_array.splice(i, 1);
        }
      }

    }

    draw_fire_left_particle_system(graphics_state, position) {
      let p = new particle_class(position);
      this.fire_particle_array.push(p);
      // console.log(this.particle_array);
      for (var i = this.fire_particle_array.length - 1; i > 0; i--) {
        this.shapes.sphere.draw(graphics_state, this.fire_particle_array[i].position, this.materials.fire_material);
        this.fire_particle_array[i].update_left();
        if (this.fire_particle_array[i].delete_particles()) {
          this.fire_particle_array.splice(i, 1);
        }
      }
    }

    draw_fire_right_particle_system(graphics_state, position) {
      let p = new particle_class(position);
      this.fire_particle_array.push(p);
      // console.log(this.particle_array);
      for (var i = this.fire_particle_array.length - 1; i > 0; i--) {
        this.shapes.sphere.draw(graphics_state, this.fire_particle_array[i].position, this.materials.fire_material);
        this.fire_particle_array[i].update_right();
        if (this.fire_particle_array[i].delete_particles()) {
          this.fire_particle_array.splice(i, 1);
        }
      }
    }

    // simulate smoke effect
    draw_smoke_particle_system(graphics_state, position) {
      let p = new particle_class(position);
      this.smoke_particle_array.push(p);
      // console.log(this.particle_array);
      for (var i = this.smoke_particle_array.length - 1; i > 0; i--) {
        this.shapes.sphere.draw(graphics_state, this.smoke_particle_array[i].position, this.materials.smoke_material);
        this.smoke_particle_array[i].update();
        if (this.smoke_particle_array[i].delete_particles()) {
          this.smoke_particle_array.splice(i, 1);
        }
      }
    }

    draw_smoke_left_particle_system(graphics_state, position) {
      let p = new particle_class(position);
      this.smoke_particle_array.push(p);
      // console.log(this.particle_array);
      for (var i = this.smoke_particle_array.length - 1; i > 0; i--) {
        this.shapes.sphere.draw(graphics_state, this.smoke_particle_array[i].position, this.materials.smoke_material);
        this.smoke_particle_array[i].update_left();
        if (this.smoke_particle_array[i].delete_particles()) {
          this.smoke_particle_array.splice(i, 1);
        }
      }
    }

    draw_smoke_right_particle_system(graphics_state, position) {
      let p = new particle_class(position);
      this.smoke_particle_array.push(p);
      // console.log(this.particle_array);
      for (var i = this.smoke_particle_array.length - 1; i > 0; i--) {
        this.shapes.sphere.draw(graphics_state, this.smoke_particle_array[i].position, this.materials.smoke_material);
        this.smoke_particle_array[i].update_right();
        if (this.smoke_particle_array[i].delete_particles()) {
          this.smoke_particle_array.splice(i, 1);
        }
      }
    }

    draw_water_particle_system(graphics_state, position) {
      let p = new particle_class(position);
      this.water_particle_array.push(p);
      // console.log(this.particle_array);
      for (var i = this.water_particle_array.length - 1; i > 0; i--) {
        this.shapes.sphere.draw(graphics_state, this.water_particle_array[i].position, this.materials.phong);
        if (this.water_particle_array[i].position[1][3] < 30) {
          this.fire_touched_water_flag = 1;
        }

        if (this.start_wind_left == 1){
            this.water_particle_array[i].update_down_left();
        }
        else if (this.start_wind_right == 1){
            this.water_particle_array[i].update_down_right();
        }
        else{
            this.water_particle_array[i].update_down();
        }
        
        if (this.water_particle_array[i].delete_particles()) {
          this.water_particle_array.splice(i, 1);
        }
      }
    }

    display(graphics_state, context) {
      graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
      const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

      let ground_position = Mat4.identity();
      let sky_position = Mat4.identity();
      sky_position = sky_position.times(Mat4.translation([0, 0, -100]).times(Mat4.scale([200, 200, 0])));
      ground_position = ground_position.times(Mat4.rotation(0.5 * Math.PI, Vec.of(1, 0, 0))).times(Mat4.scale([200, 200, 0]));
      this.shapes.rect.draw(graphics_state, ground_position, this.materials.ground_material);
      this.shapes.rect.draw(graphics_state, sky_position, this.materials.sky_material);

      function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function() {
          this.sound.play();
        }
        this.stop = function() {
          this.sound.pause();
        }
      }

      let tree1_position = Mat4.identity();
      let tree2_position = Mat4.identity().times(Mat4.translation([8, 0, 0]));
      let tree3_position = Mat4.identity().times(Mat4.translation([4, 0, 8]));
      let tree4_position = Mat4.identity().times(Mat4.translation([-4, 0, 8]));
      let tree5_position = Mat4.identity().times(Mat4.translation([12, 0, 8]));
      let tree6_position = Mat4.identity().times(Mat4.translation([-8, 0, 0]));
      let tree7_position = Mat4.identity().times(Mat4.translation([16, 0, 0]));
      let tree8_position = Mat4.identity().times(Mat4.translation([20, 0, 8]));
      let tree9_position = Mat4.identity().times(Mat4.translation([-12, 0, 8]));
      let tree10_position = Mat4.identity().times(Mat4.translation([24, 0, 0]));
      let tree11_position = Mat4.identity().times(Mat4.translation([-16, 0, 0]));
      //let cigg_position = Mat4.identity().times(Mat4.translation([0, 10, 0]));

      this.draw_trees(graphics_state, tree1_position);
      this.draw_trees(graphics_state, tree2_position);
      this.draw_trees(graphics_state, tree3_position);
      this.draw_trees(graphics_state, tree4_position);
      this.draw_trees(graphics_state, tree5_position);
      this.draw_trees(graphics_state, tree6_position);
      this.draw_trees(graphics_state, tree7_position);
      this.draw_trees(graphics_state, tree8_position);
      this.draw_trees(graphics_state, tree9_position);
      this.draw_trees(graphics_state, tree10_position);
      this.draw_trees(graphics_state, tree11_position);
      //this.shapes.test_model.draw(graphics_state, cigg_position, this.materials.phong);
      
      // the tree starts to fire 
      if (this.start_fire == 1) {
        var fireSound = new sound("/assets/forest_fire.mp3");
        fireSound.play();

        // this.origin_camera_position = graphics_state.camera_position;
        this.draw_trees_with_fire(graphics_state, tree1_position);
        this.draw_trees_with_fire(graphics_state, tree2_position);
        this.draw_trees_with_fire(graphics_state, tree3_position);
        this.draw_trees_with_fire(graphics_state, tree4_position);
        this.draw_trees_with_fire(graphics_state, tree5_position);
        this.draw_trees_with_fire(graphics_state, tree6_position);
        this.draw_trees_with_fire(graphics_state, tree7_position);
        this.draw_trees_with_fire(graphics_state, tree8_position);
        this.draw_trees_with_fire(graphics_state, tree9_position);
        this.draw_trees_with_fire(graphics_state, tree10_position);
        this.draw_trees_with_fire(graphics_state, tree11_position);
        // console.log(graphics_state.camera_position);
        if (this.start_wind_left == 1){
          var windSound = new sound("/assets/wind.mp3");
          windSound.play();
          this.draw_trees_with_fire_left(graphics_state, tree1_position);
          this.draw_trees_with_fire_left(graphics_state, tree2_position);
          this.draw_trees_with_fire_left(graphics_state, tree3_position);
          this.draw_trees_with_fire_left(graphics_state, tree4_position);
          this.draw_trees_with_fire_left(graphics_state, tree5_position);
          this.draw_trees_with_fire_left(graphics_state, tree6_position);
          this.draw_trees_with_fire_left(graphics_state, tree7_position);
          this.draw_trees_with_fire_left(graphics_state, tree8_position);
          this.draw_trees_with_fire_left(graphics_state, tree9_position);
          this.draw_trees_with_fire_left(graphics_state, tree10_position);
          this.draw_trees_with_fire_left(graphics_state, tree11_position);
          setTimeout(function() {
          windSound.stop();
        }, 3000)
        }
        if (this.start_wind_right == 1){
          this.draw_trees_with_fire_right(graphics_state, tree1_position);
          this.draw_trees_with_fire_right(graphics_state, tree2_position);
          this.draw_trees_with_fire_right(graphics_state, tree3_position);
          this.draw_trees_with_fire_right(graphics_state, tree4_position);
          this.draw_trees_with_fire_right(graphics_state, tree5_position);
          this.draw_trees_with_fire_right(graphics_state, tree6_position);
          this.draw_trees_with_fire_right(graphics_state, tree7_position);
          this.draw_trees_with_fire_right(graphics_state, tree8_position);
          this.draw_trees_with_fire_right(graphics_state, tree9_position);
          this.draw_trees_with_fire_right(graphics_state, tree10_position);
          this.draw_trees_with_fire_right(graphics_state, tree11_position);
          setTimeout(function() {
          windSound.stop();
        }, 3000)
        }

        setTimeout(function() {
          fireSound.stop();
        }, 3000)
      }

      // the helocopter animation starts
      if (this.helicopter_flag == 1) {

        if (this.helicopter_position[0][3] > tree1_position[0][3]) {
          this.helicopter_position = this.helicopter_position.times(Mat4.translation([-0.3, 0, 0]));
          this.draw_trees_with_fire(graphics_state, tree1_position);
          this.draw_trees_with_fire(graphics_state, tree2_position);
          this.draw_trees_with_fire(graphics_state, tree3_position);
          this.draw_trees_with_fire(graphics_state, tree4_position);
          this.draw_trees_with_fire(graphics_state, tree5_position);
          this.draw_trees_with_fire(graphics_state, tree6_position);
          this.draw_trees_with_fire(graphics_state, tree7_position);
          this.draw_trees_with_fire(graphics_state, tree8_position);
          this.draw_trees_with_fire(graphics_state, tree9_position);
          this.draw_trees_with_fire(graphics_state, tree10_position);
          this.draw_trees_with_fire(graphics_state, tree11_position);
          if (this.start_wind_left == 1){
            this.draw_trees_with_fire_left(graphics_state, tree1_position);
            this.draw_trees_with_fire_left(graphics_state, tree2_position);
            this.draw_trees_with_fire_left(graphics_state, tree3_position);
            this.draw_trees_with_fire_left(graphics_state, tree4_position);
            this.draw_trees_with_fire_left(graphics_state, tree5_position);
            this.draw_trees_with_fire_left(graphics_state, tree6_position);
            this.draw_trees_with_fire_left(graphics_state, tree7_position);
            this.draw_trees_with_fire_left(graphics_state, tree8_position);
            this.draw_trees_with_fire_left(graphics_state, tree9_position);
            this.draw_trees_with_fire_left(graphics_state, tree10_position);
            this.draw_trees_with_fire_left(graphics_state, tree11_position);
        }
        if (this.start_wind_right == 1){
            this.draw_trees_with_fire_right(graphics_state, tree1_position);
            this.draw_trees_with_fire_right(graphics_state, tree2_position);
            this.draw_trees_with_fire_right(graphics_state, tree3_position);
            this.draw_trees_with_fire_right(graphics_state, tree4_position);
            this.draw_trees_with_fire_right(graphics_state, tree5_position);
            this.draw_trees_with_fire_right(graphics_state, tree6_position);
            this.draw_trees_with_fire_right(graphics_state, tree7_position);
            this.draw_trees_with_fire_right(graphics_state, tree8_position);
            this.draw_trees_with_fire_right(graphics_state, tree9_position);
            this.draw_trees_with_fire_right(graphics_state, tree10_position);
            this.draw_trees_with_fire_right(graphics_state, tree11_position);
        }



          let camera_position = this.helicopter_position;
          camera_position = camera_position.times(Mat4.translation([0, 5, 50]));

          camera_position = Mat4.inverse(camera_position);

          camera_position = camera_position.map((x, i) => Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1))

          graphics_state.camera_transform = camera_position;
          // console.log(graphics_state.camera_transform);
        }
        else {
          if (this.drop_water_flag == 1) {
             this.draw_water_particle_system(graphics_state, this.helicopter_position.times(Mat4.scale([0.5, 1, 0.2])).times(Mat4.translation([0, -2, 0])));
          }
          if (this.fire_touched_water_flag == 0) {
            this.draw_trees_with_fire(graphics_state, tree1_position);
            this.draw_trees_with_fire(graphics_state, tree2_position);
            this.draw_trees_with_fire(graphics_state, tree3_position);
            this.draw_trees_with_fire(graphics_state, tree4_position);
            this.draw_trees_with_fire(graphics_state, tree5_position);
            this.draw_trees_with_fire(graphics_state, tree6_position);
            this.draw_trees_with_fire(graphics_state, tree7_position);
            this.draw_trees_with_fire(graphics_state, tree8_position);
            this.draw_trees_with_fire(graphics_state, tree9_position);
            this.draw_trees_with_fire(graphics_state, tree10_position);
            this.draw_trees_with_fire(graphics_state, tree11_position);
          } else {
            this.draw_trees_with_smoke(graphics_state, tree1_position);
            this.draw_trees_with_smoke(graphics_state, tree2_position);
            this.draw_trees_with_smoke(graphics_state, tree3_position);
            this.draw_trees_with_smoke(graphics_state, tree4_position);
            this.draw_trees_with_smoke(graphics_state, tree5_position);
            this.draw_trees_with_smoke(graphics_state, tree6_position);
            this.draw_trees_with_smoke(graphics_state, tree7_position);
            this.draw_trees_with_smoke(graphics_state, tree8_position);
            this.draw_trees_with_smoke(graphics_state, tree9_position);
            this.draw_trees_with_smoke(graphics_state, tree10_position);
            this.draw_trees_with_smoke(graphics_state, tree11_position);
          }
          
          if (this.start_wind_left == 1){
            this.draw_trees_with_smoke_left(graphics_state, tree1_position);
            this.draw_trees_with_smoke_left(graphics_state, tree2_position);
            this.draw_trees_with_smoke_left(graphics_state, tree3_position);
            this.draw_trees_with_smoke_left(graphics_state, tree4_position);
            this.draw_trees_with_smoke_left(graphics_state, tree5_position);
            this.draw_trees_with_smoke_left(graphics_state, tree6_position);
            this.draw_trees_with_smoke_left(graphics_state, tree7_position);
            this.draw_trees_with_smoke_left(graphics_state, tree8_position);
            this.draw_trees_with_smoke_left(graphics_state, tree9_position);
            this.draw_trees_with_smoke_left(graphics_state, tree10_position);
            this.draw_trees_with_smoke_left(graphics_state, tree11_position);
          }
          if (this.start_wind_right == 1){
            this.draw_trees_with_smoke_right(graphics_state, tree1_position);
            this.draw_trees_with_smoke_right(graphics_state, tree2_position);
            this.draw_trees_with_smoke_right(graphics_state, tree3_position);
            this.draw_trees_with_smoke_right(graphics_state, tree4_position);
            this.draw_trees_with_smoke_right(graphics_state, tree5_position);
            this.draw_trees_with_smoke_right(graphics_state, tree6_position);
            this.draw_trees_with_smoke_right(graphics_state, tree7_position);
            this.draw_trees_with_smoke_right(graphics_state, tree8_position);
            this.draw_trees_with_smoke_right(graphics_state, tree9_position);
            this.draw_trees_with_smoke_right(graphics_state, tree10_position);
            this.draw_trees_with_smoke_right(graphics_state, tree11_position);
          }
          let camera_position = this.test_position;
          if (this.test_position[1][3] > 20) {
            this.test_position = this.test_position.times(Mat4.translation([0, -0.05, 0.05]));

          }

          camera_position = Mat4.inverse(camera_position);

          camera_position = camera_position.map((x, i) => Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1))

          graphics_state.camera_transform = camera_position;

          var waterSound = new sound("/assets/river.mp3");
          waterSound.play();

          setTimeout(function(){
            waterSound.stop();
          }, 3000)
        }

        this.draw_helicopter(graphics_state, this.helicopter_position);
        var helicopterSound = new sound("/assets/helicopter.mp3");
          helicopterSound.play();
        setTimeout(function(){
            helicopterSound.stop();
          }, 2000)

        if (this.helicopter_flag2 == 1){
            this.draw_helicopter(graphics_state, this.helicopter_position);
            this.helicopter_position = this.helicopter_position.times(Mat4.translation([-0.3, 0, 0]));

            
            graphics_state.camera_transform = this.origin_camera_position;



            var helicopterSound = new sound("/assets/helicopter.mp3");
          helicopterSound.play();
        setTimeout(function(){
            helicopterSound.stop();
          }, 2000)

        }
      }

    }
  }


// this shader class is from assignment 3
window.Smoke_Shader = window.classes.Smoke_Shader =
  class Smoke_Shader extends Shader {
    material() { return { shader: this } }
    map_attribute_name_to_buffer_name(name) {
      return { object_space_pos: "positions" }[name];
    }

    update_GPU(g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl) {
      const proj_camera = g_state.projection_transform.times(g_state.camera_transform);


      gl.uniformMatrix4fv(gpu.model_transform_loc, false, Mat.flatten_2D_to_1D(model_transform.transposed()));

      gl.uniformMatrix4fv(gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(proj_camera.transposed()));

    }

    shared_glsl_code() {
      return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;

    }

    vertex_glsl_code() {
      return `

        attribute vec3 object_space_pos;

        uniform mat4 model_transform;

        uniform mat4 projection_camera_transform;

        void main()

        { 
          center = vec4(0,0,0,1) * model_transform;
          position = vec4( object_space_pos, 1);
          gl_Position = projection_camera_transform * model_transform * position;

        }`;

    }
    fragment_glsl_code() {
      return `
        void main()
        { 
          //m_scalar is from 1 to 0, the color decayed based on its position
          float m_scalar = exp(-2.0 * distance(center, position));
          gl_FragColor = m_scalar * vec4( 144.0/255.0, 108.0/255.0, 63.0/255.0, 1);

        }`;
    }
  }

window.fire_Shader = window.classes.fire_Shader =
  class fire_Shader extends Shader {
    material() { return { shader: this } }
    map_attribute_name_to_buffer_name(name) {
      return { object_space_pos: "positions" }[name];
    }

    update_GPU(g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl) {
      const proj_camera = g_state.projection_transform.times(g_state.camera_transform);


      gl.uniformMatrix4fv(gpu.model_transform_loc, false, Mat.flatten_2D_to_1D(model_transform.transposed()));

      gl.uniformMatrix4fv(gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(proj_camera.transposed()));

    }

    shared_glsl_code() {
      return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
              varying vec4 position2;
              varying vec4 worldCoord;
              varying vec4 origin;
      `;

    }

    vertex_glsl_code() {
      return `

        attribute vec3 object_space_pos;

        uniform mat4 model_transform;

        uniform mat4 projection_camera_transform;
        uniform mat4 modelViewMatrix;

        void main()

        { 
          center = vec4(0,0,0,1) * model_transform;
          position = vec4( object_space_pos, 1);
          worldCoord = model_transform * vec4(object_space_pos, 1.0);
          origin =modelViewMatrix * vec4(0,0,0,1);
          // position2 = projection_camera_transform.xyz * model_transform;
          gl_Position = projection_camera_transform * model_transform * position;

        }`;

    }
    fragment_glsl_code() {
      return `
        void main()
        { 
          //m_scalar is from 1 to 0, the color decayed based on its position
          // float dist = gl_FragCoord.z / gl_FragCoord.w;
          float m_scalar = 6.0 * exp(-0.1 * distance(origin, worldCoord));
          // float m_scalar = .5 + .5 * sin(29.0 * distance(center, position));
          
          gl_FragColor =  m_scalar * vec4( 226.0/255.0, 88.0/255.0, 34.0/255.0, 1);
          // gl_FragColor = vec4(worldCoord.xyz, 1.0);

        }`;
    }
  }

// a simple particle system which create a single particle that stores position and life time and x,y velocity 
window.particle_class = window.classes.particle_class =
  class particle_class {
    constructor(position) {
      this.position = position;
      this.vx = 0.015 * (Math.random() * (-2) + 1);
      this.vy = 0.1 * Math.random();
      this.life_time = 255;
    }

    updatevx(val) {
        this.vx = val;
    }
    //update the particle's x and y position based the velocity
    update() {
      this.position = this.position.times(Mat4.translation([this.vx, this.vy, 0]));
      this.life_time -= 2.5;
    }

    update_left() {
      this.vx = 0.015 * (Math.random() + 1) * 2;
      this.position = this.position.times(Mat4.translation([this.vx, this.vy, 0]));
      this.life_time -= 2.5;
    }

    update_right() {
      this.vx = 0.015 * (Math.random() + 1) * -2;
      this.position = this.position.times(Mat4.translation([this.vx, this.vy, 0]));
      this.life_time -= 2.5;
    }

    update_down()
    {
      this.position = this.position.times(Mat4.translation([this.vx, -1 * this.vy, 0]));
      this.life_time -= 2;
    }
    update_down_left()
    {
      this.vx = 0.015 * (Math.random() + 1) * 2;
      this.position = this.position.times(Mat4.translation([this.vx, -1 * this.vy, 0]));
      this.life_time -= 2;
    }

    update_down_right()
    {
      this.vx = 0.015 * (Math.random() + 1) * -2;
      this.position = this.position.times(Mat4.translation([this.vx, -1 * this.vy, 0]));
      this.life_time -= 2;
    }

    //a helper function to decide if this particle need to be deleted, return true if this particle's life time < 0 
    delete_particles() {
      return this.life_time < 0;
    }

  }