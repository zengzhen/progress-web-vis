//////////////////////////////////////////////////
/////     QUATERNION TRANSFORM ROUTINES 
//////////////////////////////////////////////////

/* STENCIL START */ 
// Not implmented yet: conjugate/inverse

quaternionFromAxisAngle = function quaternion_from_axisangle(axis,angle) {
    var q = {};
    q.a = Math.cos(angle/2);
    q.b = axis[0] * Math.sin(angle/2); // i component
    q.c = axis[1] * Math.sin(angle/2); // j component
    q.d = axis[2] * Math.sin(angle/2); // k component

    return q;
}

quaternionNormalize = function quaternion_normalize(q1) {
    var q1_norm = Math.sqrt(q1.a*q1.a + q1.b*q1.b + q1.c*q1.c + q1.d*q1.d);
    var q = {
        a : q1.a/q1_norm,
        b : q1.b/q1_norm,
        c : q1.c/q1_norm,
        d : q1.d/q1_norm,
    };
    return q;
}

quaternionMultiply = function quaternion_multiply(q1,q2) {
    var q = {};
    q.a = q1.a*a2.a - q1.b*a2.b - q1.c*a2.c - q1.d*a2.d;
    q.b = q1.a*a2.b + q1.b*a2.a + q1.c*a2.d - q1.d*a2.c; // i component
    q.c = q1.a*a2.c - q1.b*a2.d + q1.c*a2.a + q1.d*a2.b; // j component
    q.d = q1.a*a2.d + q1.b*a2.c - q1.c*a2.b + q1.d*a2.a; // k component
    return q;
}

quaternionToRotationMatrix = function quaternion_to_rotation_matrix (q) {
    // output is 4-by-4 rotation matrix
    var a = q.a; var b = q.b; var c = q.c; var d = q.d;
    var mat = [
        // homogeneous
        [(a*a)+(b*b)-(c*c)-(d*d),  2*(b*c)-2*(a*d),  2*(b*d)+2*(a*c),  0],
        [2*(b*c)+2*(a*d),  (a*a)-(b*b)+(c*c)-(d*d),  2*(c*d)-2*(a*b),  0],
        [2*(b*d)-2*(a*c),  2*(c*d)+2*(a*b),  (a*a)-(b*b)-(c*c)+(d*d),  0],
        [0,  0,  0,  1]

        // inhomogeneous: http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles 
        //[1-(2*c*c)-(2*d*d),  (2*b*c)-(2*d*a),    (2*b*d)+(2*c*a),    0], 
        //[(2*b*c)+(2*d*a),    1-(2*b*b)-(2*d*d),  (2*c*d)-(2*b*a),    0], 
        //[(2*b*d)-(2*c*a),    (2*c*d)+(2*b*a),    1-(2*b*b)-(2*c*c),  0], 
        //[0,  0,  0,  1]
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/
    ]
    return mat;
}

/* STENCIL REPLACE START
    // STENCIL: reference quaternion code has the following functions:
    //   quaternion_from_axisangle
    //   quaternion_normalize
    //   quaternion_to_rotation_matrix
    //   quaternion_multiply
STENCIL REPLACE */ 
/* STENCIL END */ 
