import { Injectable } from '@angular/core';
import {Observable, Subject , of } from 'rxjs';
import { HttpClient} from '@angular/common/http';



import { Profesor, Grupo, Alumno, Matricula, Juego, Punto, Nivel, AlumnoJuegoDePuntos,
        Equipo, AsignacionEquipo, AsignacionPuntosJuego, EquipoJuegoDePuntos, Coleccion,
        AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Cromo, HistorialPuntosAlumno, HistorialPuntosEquipo,
        Album, AlbumEquipo, Insignia, AlumnoJuegoDeCompeticionLiga, EquipoJuegoDeCompeticionLiga,
        Jornada, EnfrentamientoLiga, EnfrentamientoTorneo, Pregunta,  PreguntaDelCuestionario, Cuestionario, AlumnoJuegoDeCompeticionFormulaUno,
        EquipoJuegoDeCompeticionFormulaUno, AlumnoJuegoDeCompeticionTorneo, EquipoJuegoDeCompeticionTorneo, SesionClase, AsistenciaClase, FamiliaAvatares, JuegoDeAvatar,
        AlumnoJuegoDeAvatar, JuegoDeCuestionario, AlumnoJuegoDeCuestionario, AlumnoJuegoDeCuento, JuegoDeCuento,
        RespuestaJuegoDeCuestionario, JuegoDeVotacionUnoATodos, AlumnoJuegoDeVotacionUnoATodos, Rubrica,
        JuegoDeVotacionTodosAUno, AlumnoJuegoDeVotacionTodosAUno, FamiliaDeImagenesDePerfil,
        CuestionarioSatisfaccion, JuegoDeCuestionarioSatisfaccion, AlumnoJuegoDeCuestionarioSatisfaccion,
        JuegoDeEncuestaRapida, JuegoDeVotacionRapida, JuegoDeCuestionarioRapido, JuegoDeCogerTurnoRapido, JuegoDePuntos, AlumnoJuegoDeControlDeTrabajoEnEquipo, EquipoJuegoDeCuestionario, Evento, JuegoDeControlDeTrabajoEnEquipo, JuegoDeVotacionAOpciones, AlumnoJuegoDeVotacionAOpciones, Familia} from '../clases/index';

import { Escenario } from '../clases/Escenario';
import { PuntoGeolocalizable } from '../clases/PuntoGeolocalizable';
import { JuegoDeGeocaching } from '../clases/JuegoDeGeocaching';
import { AlumnoJuegoDeGeocaching } from '../clases/AlumnoJuegoDeGeocaching';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {EquipoJuegoEvaluado} from '../clases/EquipoJuegoEvaluado';
import {AlumnoJuegoEvaluado} from '../clases/AlumnoJuegoEvaluado';
// import {host} from '../URLs/urls';
import * as URL from '../URLs/urls';
import { RecursoCuento } from '../clases/clasesParaJuegoDeCuentos/RecursoCuento';
import { EquipoJuegoDeVotacionUnoATodos } from '../clases/EquipoJuegoDeVotacionUnoATodos';
import { RespuestaEquipoJuegoDeCuestionario } from '../clases/RespuestaEquipoJuegoDeCuestionario';
import { AlumnoJuegoDeEvaluacion } from '../clases/AlumnoJuegoDeEvaluacion';
import { EquipoJuegoDeEvaluacion } from '../clases/EquipoJuegoDeEvaluacion';
import { AlumnoJuegoDeLibro } from '../clases/AlumnoJuegoDeLibro';
import { RecursoLibro } from '../clases/clasesParaLibros/recursoLibro';
import { JuegoDeLibros } from '../clases/JuegoDeLibros';
import { AlumnoJuegoDeMemorama } from '../clases/AlumnoJuegoDeMemorama';
import { EquipoJuegoDeMemorama } from '../clases/EquipoJuegoDeMemorama';
import { JuegoMEMORAMA } from '../clases/JuegoMemorama';
import{Carta} from 'src/app/clases/Carta';

@Injectable({
  providedIn: 'root'
})
export class PeticionesAPIService {


  private host = URL.host;

  private APIUrlProfesores = this.host + ':3000/api/Profesores';
  private APIUrlAlumnos = this.host + ':3000/api/Alumnos';
  private APIUrlGrupos = this.host + ':3000/api/Grupos';
  private APIUrlMatriculas = this.host + ':3000/api/Matriculas';
  private APIUrlEquipos = this.host + ':3000/api/Equipos';
  private APIUrlColecciones = this.host + ':3000/api/Colecciones';
  private APIUrlCromos = this.host + ':3000/api/Cromos';
  private APIUrlPreguntas = this.host + ':3000/api/Preguntas';
  private APIUrlCuestionarios = this.host + ':3000/api/Cuestionarios';
  private APIUrlPreguntaDelCuestionario = this.host + ':3000/api/PreguntasDelCuestionario';
  private APIUrlAlumnoJuegoDeCuestionario = this.host + ':3000/api/AlumnosJuegoDeCuestionario';
  private APIUrlEquipoJuegoDeCuestionario = this.host + ':3000/api/equiposJuegoDeCuestionario';
  private APIUrlJuegoDeCuestionario = this.host + ':3000/api/JuegosDeCuestionario';
  private APIUrlRespuestasJuegoDeCuestionario = this.host + ':3000/api/respuestasJuegoDeCuestionario';
  private APIUrlRespuestasEquipoJuegoDeCuestionario = this.host + ':3000/api/respuestasEquipoJuegoDeCuestionario';
 
  private APIUrlAlumnoJuegoDeLibro = this.host + ':3000/api/alumnojuegodecuento';
  private APIUrlJuegodeLibro = this.host + ':3000/api/juegodelibro';
  private APIUrlJuegoDePuntos = this.host + ':3000/api/JuegosDePuntos';
  private APIUrlAlumnoJuegoDePuntos = this.host + ':3000/api/AlumnoJuegosDePuntos';
  private APIUrlEquipoJuegoDePuntos = this.host + ':3000/api/EquiposJuegosDePuntos';
  private APIUrlPuntosJuego = this.host + ':3000/api/AsignacionPuntosJuego';
  private APIUrlNiveles = this.host + ':3000/api/Niveles';
  private APIUrlHistorialPuntosAlumno = this.host + ':3000/api/HistorialesPuntosAlumno';
  private APIUrlHistorialPuntosEquipo = this.host + ':3000/api/HistorialesPuntosEquipo';
  private APIUrlJuegoDeColeccion = this.host + ':3000/api/JuegosDeColeccion';
  private APIUrlAlumnoJuegoDeColeccion = this.host + ':3000/api/AlumnosJuegoDeColeccion';
  private APIUrlEquipoJuegoDeColeccion = this.host + ':3000/api/EquiposJuegoDeColeccion';
  private APIUrlAlbum = this.host + ':3000/api/Albumes';
  private APIUrlAlbumEquipo = this.host + ':3000/api/albumsEquipo';
  private APIUrlJuegoDeCompeticionLiga = this.host + ':3000/api/JuegosDeCompeticionLiga';
  private APIUrlAlumnoJuegoDeCompeticionLiga = this.host + ':3000/api/AlumnosJuegoDeCompeticionLiga';
  private APIUrlEquipoJuegoDeCompeticionLiga = this.host + ':3000/api/EquiposJuegoDeCompeticionLiga';
  private APIUrlJornadasJuegoDeCompeticionLiga = this.host + ':3000/api/JornadasDeCompeticionLiga';
  private APIUrlEnfrentamientosLiga = this.host + ':3000/api/EnfrentamientosLiga';
  private APIUrlJuegoDeCompeticionFormulaUno = this.host + ':3000/api/JuegosDecompeticionFormulaUno';
  private APIUrlAlumnoJuegoDeCompeticionFormulaUno = this.host + ':3000/api/AlumnosJuegoDeCompeticionFormulaUno';
  private APIUrlEquipoJuegoDeCompeticionFormulaUno = this.host + ':3000/api/EquiposJuegoDeCompeticionFormulaUno';
  private APIUrlJornadasJuegoDeCompeticionFormulaUno = this.host + ':3000/api/JornadasDeCompeticionFormulaUno';
  private APIUrlJuegoDeCompeticionTorneo = this.host + ':3000/api/juegosDeCompeticionTorneo';
  private APIUrlEnfrentamientosTorneo = this.host + ':3000/api/EnfrentamientosTorneo';
  private APIUrlAlumnoJuegoDeCompeticionTorneo = this.host + ':3000/api/AlumnosJuegoDeCompeticionTorneo';
  private APIUrlEquipoJuegoDeCompeticionTorneo = this.host + ':3000/api/EquiposJuegoDeCompeticionTorneo';
  private APIUrlJornadasJuegoDeCompeticionTorneo = this.host + ':3000/api/JornadasDeCompeticionTorneo';
  private APIUrlJuegoDeGeocaching = this.host + ':3000/api/JuegosDeGeocaching';

  private APIUrlAsistenciasClase = this.host + ':3000/api/AsistenciasClase';
  private APIUrlSesionesClase = this.host + ':3000/api/SesionesClase';

  private APIUrlFamiliarAvatares = this.host + ':3000/api/familiasAvatares';
  private APIUrlAlumnoJuegoDeGeocaching = this.host + ':3000/api/AlumnosJuegoDeGeocaching';




  // Para cargar y descargar imagenes
  private APIUrlImagenAlumno = this.host + ':3000/api/imagenes/ImagenAlumno';
  private APIUrlImagenColeccion = this.host + ':3000/api/imagenes/ImagenColeccion';
  private APIUrlImagenCromo = this.host + ':3000/api/imagenes/ImagenCromo';
  private APIUrlImagenNivel = this.host + ':3000/api/imagenes/ImagenNivel';
  private APIUrlImagenInsignia = this.host + ':3000/api/imagenes/ImagenInsignia';
  private APIUrlLogosEquipos = this.host + ':3000/api/imagenes/LogosEquipos';

  private APIUrlImagenesAvatares = this.host + ':3000/api/imagenes/ImagenesAvatares';
  private APIUrlJuegoDeAvatar = this.host + ':3000/api/juegosDeAvatar';
  private APIUrlAlumnoJuegoDeAvatar = this.host + ':3000/api/alumnosJuegoAvatar';
  private APIUrlAudiosAvatares = this.host + ':3000/api/imagenes/AudiosAvatares';


  private APIUrlEscenarios = this.host + ':3000/api/Escenarios';
  private APIUrlPuntosGeolocalizables = this.host + ':3000/api/PuntosGeolocalizables';



  private APIurlImagenesCuentos = this.host + ':3000/api/imagenes';
  private APIurlAlumnoJuego = this.host + ':3000/api/AlumnosJuegoDeCuento';
  private APIurlCuento = this.host + ':3000/api/Cuentos';
  private urlParaEscena = this.host + ':3000/api/Escenas';
  private urlimagenes = this.host + ':3000/api/imagenes';
  private APIUrlRecursosJuegoDeCuento = this.host + ':3000/api/RecursosJuegoDeCuento';
  private APIUrlJuegoDeCuento = this.host + ':3000/api/JuegosDeCuento';
  private APIurlRecursosCuentos = this.host + ':3000/api/RecursosCuentos';





  private APIURLJuegoDeEvaluacion = this.host + ':3000/api/juegosDeEvaluacion';
  private APIURLEquiposJuegoEvaluado = this.host + ':3000/api/equiposJuegoDeEvaluacion';
  private APIURLAlumnoJuegoEvaluado = this.host + ':3000/api/alumnosJuegoDeEvaluacion';
  private APIURLRubricas = this.host + ':3000/api/Rubricas';

  private APIUrlJuegoDeVotacionUnoATodos = this.host + ':3000/api/JuegosDeVotacionUnoATodos';
  private APIUrlAlumnoJuegoDeVotacionUnoATodos = this.host + ':3000/api/alumnosJuegoDeVotacionUnoATodos';
  private APIUrlEquipoJuegoDeVotacionUnoATodos = this.host + ':3000/api/equiposJuegoDeVotacionUnoATodos';


  private APIUrlJuegoDeVotacionTodosAUno = this.host + ':3000/api/JuegosDeVotacionTodosAUno';
  private APIUrlAlumnoJuegoDeVotacionTodosAUno = this.host + ':3000/api/alumnosJuegoDeVotacionTodosAUno';

  private APIUrlJuegoDeVotacionAOpciones = this.host + ':3000/api/JuegosDeVotacionAOpciones';
  private APIUrlAlumnoJuegoDeVotacionAOpciones = this.host + ':3000/api/alumnosJuegoDeVotacionAOpciones';

  private APIUrlFamiliasDeImagenesDePerfil = this.host + ':3000/api/familiasImagenesPerfil';

  private APIUrlImagenesPerfil = this.host + ':3000/api/imagenes/ImagenesPerfil';

  private APIUrlCuestionariosSatisfaccion = this.host + ':3000/api/cuestionariosSatisfaccion';

  private APIUrlImagenesPreguntas = this.host + ':3000/api/imagenes/ImagenesPreguntas';

  private APIUrlJuegoDeCuestionarioSatisfaccion = this.host + ':3000/api/juegosDeCuestionarioSatisfaccion';
  private APIUrlAlumnoJuegoDeCuestionarioSatisfaccion = this.host + ':3000/api/alumnosJuegoDeCuestionarioSatisfaccion';
  private APIUrlJuegoDeEncuestaRapida = this.host + ':3000/api/juegosDeEncuestaRapida';
  private APIUrlJuegoDeVotacionRapida = this.host + ':3000/api/juegosDeVotacionRapida';
  private APIUrlJuegoDeCuestionarioRapido = this.host + ':3000/api/juegosDeCuestionarioRapido';
  private APIUrlJuegoDeCogerTurnoRapido = this.host + ':3000/api/juegosDeCogerTurnoRapido';

  private APIUrlJuegoDeControlDeTrabajoEnEquipo = this.host + ':3000/api/juegosDeControlDeTrabajoEnEquipo';
  private APIUrlAlumnoJuegoDeControlDeTrabajoEnEquipo = this.host + ':3000/api/alumnosJuegoDeControlDeTrabajoEnEquipo';
  private APIUrlEventos = this.host + ':3000/api/Eventos';

  private APIUrlAlumnoJuegoDeMemorama = this.host + ':3000/api/alumnosJuegoDeMemorama';
  private APIUrlEquipoJuegoDeMemorama = this.host + ':3000/api/equiposJuegoDeMemorama';
  private APIURLJuegoDeMemorama = this.host + ':3000/api/juegosDeMemorama'
  private APIUrlFamiliasMemorama = this.host + ':3000/api/familiasMemorama';
  private APIUrlCartaMemorama = this.host + ':3000/api/cartasMemorama';
  // Para cargar y descargar imagenes
  private APIUrlImagenesCartasMemorama = this.host + ':3000/api/imagenes/ImagenesCartasMemorama';
  private APIUrlImagenesFamiliaMemorama = this.host + ':3000/api/imagenes/ImagenesFamiliasMemorama';



  constructor(
    private http: HttpClient,
    private httpImagenes: HttpClient
  ) {
  }

  /* Las funciones estar agrupadas en los bloques siguientes:
    GESTION DE PROFESORES Y ALUMNOS
    GESTIÓN DE GRUPOS
    GESTION DE EQUIPOS
    GESTION DE SESIONES DE CLASE
    GESTION DE TIPOS DE PUNTOS E INSIGNIAS
    GESTION DE COLECCIONES
    GESTION JUEGO DE PUNTOS
    GESTION JUEGO DE PUNTOS INDIVIDUAL
    GESTION JUEGO DE PUNTOS POR EQUIPOS
    GESTION DE JUEGO DE COLECCION
    GESTION DE JUEGO DE COLECCIÓN INDIVIDUAL
    GESTION DE JUEGO DE COLECCION POR EQUIPOS
    GESTION JUEGOS DE COMPETICION
    GESTION JUEGOS DE COMPETICION TIPO LIGA
    GESTION COMPETICION LIGA INDIVIDUAL
    GESITON COMPETICION LIGA POR EQUIPOS
    GESTION JUEGO DE COMPETICION TIPO FORMULA 1
    GESTION COMPETICION FORMULA 1 INDIVIDUAL
    GESTION JUEGO COMPETICION FORMULA 1 POR EQUIPOS
    GESTION DE PREGUNTAS
    GESTION DE CUESTIONARIOS
    GESTION DE JUEGOS DE CUESTIONARIO
    GESTION DE ALUMNOS EN JUEGOS DE CUESTIONARIO
    GESTION DE ESCENARIOS
    GESTION DE JUEGOS DE GEOCACHING
    GESTION DE ALUMNOS EN JUEGOS DE GEOCACHING
    GESTION DE FAMILIAS DE AVATAES
    GESTION DE JUEGOS DE AVATARES
    GESTION DE ALUMNOS EN JUEGOS DE AVATARES

    GESTION JUEGO DE CUENTOS

    GESTIÓN DE REGISTRO DE ACTIVIDAD (EVENTOS)

  */

  /////////////////////  GESTION DE PROFESORES Y ALUNNOS ///////////////////////////////

  public DameProfesor(nombre: string, pass: string): Observable<Profesor> {

    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][NombreUsuario]=' + nombre + '&filter[where][Password]=' + pass);
  }

  public BuscaNombreUsuario(username: string): Observable<Profesor> {
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][NombreUsuario]=' + username);
  }

  public DameProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.APIUrlProfesores);
  }

  // Esta consulta es para cuando se ha olvidado la contraseña y solo puede darnos
  // su nombre de usuario (de momento el nombre)

  public DameContrasena(nombre: string): Observable<Profesor> {
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][NombreUsuario]=' + nombre);
  }


  public RegistraProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.post<Profesor>(this.APIUrlProfesores, profesor);
  }

  public ModificaProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.put<Profesor>(this.APIUrlProfesores + '/' + profesor.id, profesor);
  }


  public DameTodosMisAlumnos(profesorId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlProfesores + '/' + profesorId + '/alumnos');
  }

  public DameAlumno(alumnoId: number): Observable<Alumno> {
    return this.http.get<Alumno>(this.APIUrlAlumnos + '/' + alumnoId);
  }

  public DameTodosLosAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlAlumnos);
  }



  // Esta no se para que se usa habiendo DameTodosMisAlumnos
  public DameAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlAlumnos);
  }

  public DameAlumnoConcreto(alumno: Alumno, ProfesorId: number): Observable<Alumno> {
      return this.http.get<Alumno>(this.APIUrlProfesores + '/' + ProfesorId + '/alumnos?filter[where][Nombre]=' + alumno.Nombre +
      '&filter[where][PrimerApellido]=' + alumno.PrimerApellido + '&filter[where][SegundoApellido]=' + alumno.SegundoApellido);

  }

  public DameImagenAlumno(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenAlumno + '/download/' + imagen,
      { responseType: 'blob' });
  }

  public CreaAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.APIUrlAlumnos, alumno);
  }

  public BorraAlumno(alumnoId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlAlumnos + '/' + alumnoId);
  }

  public ModificaAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(this.APIUrlAlumnos + '/' + alumno.id, alumno);
  }

  public AsignaAlumnoAlProfesor(alumno: Alumno, profesorId: number): Observable<Alumno> {
    return this.http.post<Alumno>(this.APIUrlProfesores + '/' + profesorId + '/alumnos', alumno);
  }

  /////////////////////////////////////////// GESTIÓN DE GRUPOS ///////////////////////////////

  public DameGrupo(grupoID: number): Observable<Grupo> {
    return this.http.get<Grupo>(this.APIUrlGrupos + '/' + grupoID);
  }

  public DameGruposProfesor(profesorId: number): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.APIUrlProfesores + '/' + profesorId + '/grupos');
  }

  public CreaGrupo(grupo: Grupo, profesorId: number): Observable<Grupo> {
    return this.http.post<Grupo>(this.APIUrlProfesores + '/' + profesorId + '/grupos', grupo);
  }

  public ModificaGrupo(grupo: Grupo, profesorId: number, grupoId: number): Observable<Grupo> {
    return this.http.put<Grupo>(this.APIUrlProfesores + '/' + profesorId + '/grupos/' + grupoId, grupo);
  }

  public BorraGrupo(profesorId: number, grupoId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/grupos/' + grupoId);
  }

  public DameAlumnosGrupo(grupoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlGrupos + '/' + grupoId + '/alumnos');
  }

  public DameMatriculasGrupo(grupoId: number): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId);
  }

  public BorraMatricula(matriculaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlMatriculas + '/' + matriculaId);
  }

  public BorraMatriculaAlumno(alumnoId: number, grupoId: number): Observable<Matricula> {
    return this.http.delete<any>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId + '&filter[where][alumnoId]=' + alumnoId);
  }

  public MatriculaAlumnoEnGrupo(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.APIUrlMatriculas, matricula);
  }

  public DameMatriculaAlumno(alumnoId: number, grupoId: number): Observable<Matricula> {
    return this.http.get<Matricula>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId + '&filter[where][alumnoId]=' + alumnoId);
  }

  ///////////////////////////////////// GESTION DE EQUIIPOS ///////////////////////////////


  public DameEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlEquipos);
  }

  public DameEquipo(equipoID: number): Observable<Equipo> {
    return this.http.get<Equipo>(this.APIUrlEquipos + '/' + equipoID);
  }

  public DameEquiposDelGrupo(grupoId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlGrupos + '/' + grupoId + '/equipos');
  }

  public BorraEquipoDelGrupo(equipo: Equipo): Observable<any> {
    return this.http.delete<any>(this.APIUrlGrupos + '/' + equipo.grupoId + '/equipos/' + equipo.id);
  }

  public CreaEquipo(equipo: Equipo, grupoId: number): Observable<Equipo> {
    return this.http.post<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos', equipo);
  }

  public PonLogoEquipo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlLogosEquipos + '/upload', formData);
  }

  public BorraLogoEquipo(logo: string): Observable<any> {
    return this.http.delete<any>(this.APIUrlLogosEquipos + '/files/' + logo);
  }

  public DameLogoEquipo(logo: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlLogosEquipos + '/download/' + logo,
      { responseType: 'blob' });
  }

  // public ModificaEquipo(equipo: Equipo, grupoId: number, equipoId: number): Observable<Equipo> {
  //   return this.http.put<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos/' + equipoId, equipo);
  // }

  // SE USA PARA EDITAR UN EQUIPO
  public ModificaEquipo(equipo: Equipo): Observable<Equipo> {
    return this.http.put<Equipo>(this.APIUrlEquipos + '/' + equipo.id, equipo);
  }

  public DameAlumnosEquipo(equipoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlEquipos + '/' + equipoId + '/alumnos');
  }

  public DameEquiposDelAlumno(alumnoId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlAlumnos + '/' + alumnoId + '/equipos');
  }

  public DameAsignacionesDelEquipo(equipo: Equipo): Observable<AsignacionEquipo[]> {
    // Da las asignaciones de los alumnos del equipo
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + equipo.grupoId + '/asignacionEquipos?filter[where][equipoId]='
      + equipo.id);
  }

  public DameAsignacionesEquipoDelGrupo(grupoId: number): Observable<AsignacionEquipo[]> {
    // Da las asignaciones a equipos de todos los alumnos del grupo (sean del equipo que sean)
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos');
  }

  public DameAsignacionEquipoAlumno(alumnoId: number, equipoId: number, grupoId: number): Observable<AsignacionEquipo> {
    // Da la asignación a un equipo de un alumno concreto
    return this.http.get<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos?filter[where][equipoId]=' + equipoId +
      '&filter[where][alumnoId]=' + alumnoId);
  }

  public ModificaAsignacionEquipoAlumno(asignacionEquipo: AsignacionEquipo, grupoId: number, asignacionEquipoId: number):
    Observable<AsignacionEquipo> {
    return this.http.put<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos/' +
      asignacionEquipoId, asignacionEquipo);
  }

  public BorraAlumnoEquipo(asignacionEquipo: AsignacionEquipo): Observable<any> {
    const url = this.APIUrlGrupos + '/' + asignacionEquipo.grupoId + '/asignacionEquipos/'
    + asignacionEquipo.id;
    console.log ('voy a borrar ', url);
    return this.http.delete<any>(this.APIUrlGrupos + '/' + asignacionEquipo.grupoId + '/asignacionEquipos/'
      + asignacionEquipo.id);
  }

  public PonAlumnoEquipo(asignacionEquipos: AsignacionEquipo, grupoId: number): Observable<AsignacionEquipo> {
    return this.http.post<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos', asignacionEquipos);
  }

  ////////////////////////////////// GESTION DE SESIONES DE CLASE //////////////////////

  public CreaSesionClase(sesion: SesionClase, grupoId: number): Observable<SesionClase> {
    return this.http.post<SesionClase>(this.APIUrlGrupos + '/' + grupoId + '/sesionesClase', sesion);
  }

  public ModificaSesionClase(sesion: SesionClase): Observable<SesionClase> {
    return this.http.put<SesionClase>(this.APIUrlSesionesClase + '/' + sesion.id, sesion);
  }

  public RegistraAsistenciaAlumno(asistencia: AsistenciaClase): Observable<AsistenciaClase> {
    return this.http.post<AsistenciaClase>(this.APIUrlAsistenciasClase, asistencia);
  }

  public DameSesionesClaseGrupo(grupoId: number): Observable<SesionClase[]> {
    return this.http.get<SesionClase[]>(this.APIUrlSesionesClase + '?filter[where][grupoId]=' + grupoId);
  }

  public DameAsistenciasClase(sesionClaseId: number): Observable<AsistenciaClase[]> {
    return this.http.get<AsistenciaClase[]>(this.APIUrlAsistenciasClase + '?filter[where][sesionClaseId]=' + sesionClaseId);
  }

  public BorraSesionClase(sesionClaseId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlSesionesClase + '/' + sesionClaseId);
  }

  public BorraAsistenciaClase(asistenciaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlAsistenciasClase + '/' + asistenciaId);
  }

  ////////////////////////////////// GESTION DE TIPOS DE PUNTOS E INSIGNIAS ////////////////////////////////////

  public DameTipoDePunto(puntoId: number, profesorId: number): Observable<Punto> {
    return this.http.get<Punto>(this.APIUrlProfesores + '/' + profesorId + '/puntos/' + puntoId);
  }

  public CreaTipoDePunto(punto: Punto, profesorId: number): Observable<Punto> {
    return this.http.post<Punto>(this.APIUrlProfesores + '/' + profesorId + '/puntos', punto);
  }

  public ModificaTipoDePunto(punto: Punto, profesorId: number, puntoId: number): Observable<Punto> {
    return this.http.put<Punto>(this.APIUrlProfesores + '/' + profesorId + '/puntos/' + puntoId, punto);
  }

  public BorraTipoDePunto(puntoId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/puntos/' + puntoId);
  }

  public CreaInsignia(insignia: Insignia, profesorId: number): Observable<Insignia> {
    return this.http.post<Insignia>(this.APIUrlProfesores + '/' + profesorId + '/insignia', insignia);
  }

  public DameInsignias(profesorId: number): Observable<Insignia[]> {
    return this.http.get<Insignia[]>(this.APIUrlProfesores + '/' + profesorId + '/insignia');
  }

  public ModificaInsignia(insignia: Insignia, profesorId: number, insigniaId: number): Observable<Insignia> {
    return this.http.put<Insignia>(this.APIUrlProfesores + '/' + profesorId + '/insignia/' + insigniaId, insignia);
  }

  public BorraInsignia(insigniaId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/insignia/' + insigniaId);
  }

  public PonImagenInsignia(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenInsignia + '/upload', formData);
  }

  public DameImagenInsignia(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenInsignia + '/download/' + imagen,
      { responseType: 'blob' });
  }











  /////////////////////////////////////// GESTION DE COLECCIONES ////////////////////////////////////////////////////

  public CreaColeccion(coleccion: Coleccion, profesorId: number): Observable<Coleccion> {
    return this.http.post<Coleccion>(this.APIUrlProfesores + '/' + profesorId + '/coleccions', coleccion);
  }

  public DameColeccion(coleccionId: number): Observable<Coleccion> {
    return this.http.get<Coleccion>(this.APIUrlColecciones + '/' + coleccionId);
  }

  public PonImagenColeccion(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenColeccion + '/upload', formData);
  }

  public DameImagenColeccion(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenColeccion + '/download/' + imagen,
      { responseType: 'blob' });
  }

  public BorraColeccion(coleccionId: number, profesorId: number): Observable<any> {

    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/coleccions/' + coleccionId);
  }

  public PonCromoColeccion(cromo: Cromo, coleccionId: number): Observable<Cromo> {
    return this.http.post<Cromo>(this.APIUrlColecciones + '/' + coleccionId + '/cromos', cromo);
  }

  public PonImagenCromo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenCromo + '/upload', formData);
  }

  public DameImagenCromo(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenCromo + '/download/' + imagen,
      { responseType: 'blob' });
  }

  public ModificaCromoColeccion(cromo: Cromo, coleccionId: number, cromoId: number): Observable<Cromo> {
    return this.http.put<Cromo>(this.APIUrlColecciones + '/' + coleccionId + '/cromos/' + cromoId, cromo);
  }

  public BorrarCromo(cromoId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlCromos + '/' + cromoId);
  }

  public DameCromosColeccion(coleccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlColecciones + '/' + coleccionId + '/cromos');
  }

  public BorrarImagenColeccion(ImagenColeccion: string): Observable<any> {

    return this.http.delete<any>(this.APIUrlImagenColeccion + '/files/' + ImagenColeccion);
  }

  public BorrarImagenCromo(ImagenCromo: string): Observable<any> {
    return this.http.delete<any>(this.APIUrlImagenCromo + '/files/' + ImagenCromo);
  }

  // SE USA PARA EDITAR LA COLECCIÓN DEL PROFESOR. AMBOS IDENTIFICADORES LOS PASAMOS COMO PARÁMETRO
  public ModificaColeccion(coleccion: Coleccion, profesorId: number, coleccionId: number): Observable<Coleccion> {
    return this.http.put<Coleccion>(this.APIUrlProfesores + '/' + profesorId + '/coleccions/' + coleccionId, coleccion);
  }

  public DameColeccionesDelProfesor(profesorId: number): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.APIUrlProfesores + '/' + profesorId + '/coleccions');
  }

  public DameColeccionesPublicas(): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.APIUrlColecciones
      + '?filter[where][Publica]=true');
  }


  ///////////////////////////////////////////// GESTION JUEGO DE PUNTOS //////////////////////////////////////////////

  public DameJuegoDePuntos(juegoDePuntosID: number): Observable<JuegoDePuntos> {
    return this.http.get<JuegoDePuntos>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosID);
  }

  public CreaJuegoDePuntos(juego: JuegoDePuntos, grupoId: number): Observable<JuegoDePuntos> {
    return this.http.post<JuegoDePuntos>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos', juego);
  }

  public AsignaPuntoJuego(asignacionPuntoJuego: AsignacionPuntosJuego) {
    return this.http.post<AsignacionPuntosJuego>(this.APIUrlPuntosJuego, asignacionPuntoJuego);
  }

  public DamePuntosJuego(juegoDePuntosId: number) {
    return this.http.get<AsignacionPuntosJuego[]>(this.APIUrlPuntosJuego + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  public BorraPuntoJuego(puntoId: number): any {
    return this.http.delete<any>(this.APIUrlPuntosJuego + '/' + puntoId);
  }


  public DameTiposDePuntos(profesorId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIUrlProfesores + '/' + profesorId + '/puntos');
  }

  public CreaNivel(nivel: Nivel, juegoDePuntosId: number) {
    return this.http.post<Nivel>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels', nivel);
  }

  public DameNiveles(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.APIUrlNiveles);
  }

  public DameNivel(nivelID: number): Observable<Nivel> {
    return this.http.get<Nivel>(this.APIUrlNiveles + '/' + nivelID);
  }

  public DameNivelesJuego(juegoDePuntosId: number): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.APIUrlNiveles + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  public BorraNivel(nivelId: number): any {
    return this.http.delete<any>(this.APIUrlNiveles + '/' + nivelId);
  }

  public PonImagenNivel(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenNivel + '/upload', formData);
  }

  public DameImagenNivel(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenNivel + '/download/' + imagen,
      { responseType: 'blob' });
  }

  public BorraImagenNivel(imagenNivel: string): Observable<any> {
    return this.http.delete<any>(this.APIUrlImagenNivel + '/files/' + imagenNivel);
  }

  // public CambiaEstadoJuegoDePuntos(juegoDePuntos: Juego, juegoDePuntosId: number, grupoId: number): Observable<Juego> {
  //   return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos/' + juegoDePuntosId, juegoDePuntos);
  // }
  public CambiaEstadoJuegoDePuntos(juego: Juego): Observable<Juego> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Juego>(this.APIUrlJuegoDePuntos + '/' + juego.id , juego);
  }

  public BorraJuegoDePuntos(juegoDePuntosId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId);
  }

  /////////////////////////////////// GESTION JUEGO DE PUNTOS INDIVIDUAL ////////////////////////////////////////////////////////

  public DameJuegoDePuntosGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos');
  }

  public DameAlumnosJuegoDePuntos(juegoDePuntosId: number): Observable<Alumno[]> {

    return this.http.get<Alumno[]>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/alumnos');
  }

  public DamePuntosJuegoDePuntos(juegoDePuntosId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/puntos');
  }

  public DameNivelesJuegoDePuntos(juegoDePuntosId: number): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels');
  }

  public DameInscripcionAlumnoJuegoDePuntos(alumnoId: number, juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    return this.http.get<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos + '?filter[where][alumnoId]=' + alumnoId
      + '&filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  public BorraInscripcionAlumnoJuegoDePuntos(inscripcionId: number): any {
    return this.http.delete<any>(this.APIUrlAlumnoJuegoDePuntos + '/' + inscripcionId);
  }

  public DameInscripcionesAlumnoJuegoDePuntos(juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos[]> {
    return this.http.get<AlumnoJuegoDePuntos[]>(this.APIUrlAlumnoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  public InscribeAlumnoJuegoDePuntos(alumnoJuegoDePuntos: AlumnoJuegoDePuntos) {
    return this.http.post<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos, alumnoJuegoDePuntos);
  }

  public BorrarPuntosAlumno(historialPuntosAlumnoId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.delete<HistorialPuntosAlumno[]>(this.APIUrlHistorialPuntosAlumno + '/' + historialPuntosAlumnoId);
  }

  public PonPuntosJuegoDePuntos(alumnoJuegoDePuntos: AlumnoJuegoDePuntos, alumnoJuegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos + '/' + alumnoJuegoDePuntosId, alumnoJuegoDePuntos);
  }

  public DameHistorialPuntosAlumno(alumnoJuegoDePuntosId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.get<HistorialPuntosAlumno[]>(this.APIUrlHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
      + alumnoJuegoDePuntosId);
  }

  public PonHistorialPuntosAlumno(historial: HistorialPuntosAlumno): Observable<HistorialPuntosAlumno> {
    return this.http.post<HistorialPuntosAlumno>(this.APIUrlHistorialPuntosAlumno, historial);
  }

  public DameHistorialDeUnPunto(alumnoJuegoDePuntosId: number, puntoId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.get<HistorialPuntosAlumno[]>(this.APIUrlHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
      + alumnoJuegoDePuntosId + '&filter[where][puntoId]=' + puntoId);
  }


  //////////////////////////////////////// GESTION JUEGO DE PUNTOS POR EQUIPOS ///////////////////////////////////////////////////
  public DameEquiposJuegoDePuntos(juegoDePuntosId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/equipos');
  }

  public InscribeEquipoJuegoDePuntos(equipoJuegoDePuntos: EquipoJuegoDePuntos) {
    return this.http.post<EquipoJuegoDePuntos>(this.APIUrlEquipoJuegoDePuntos, equipoJuegoDePuntos);
  }

  public DameInscripcionesEquipoJuegoDePuntos(juegoDePuntosId: number): Observable<EquipoJuegoDePuntos[]> {
    return this.http.get<EquipoJuegoDePuntos[]>(this.APIUrlEquipoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  public BorraInscripcionEquipoJuegoDePuntos(inscripcionId: number): any {
    return this.http.delete<any>(this.APIUrlEquipoJuegoDePuntos + '/' + inscripcionId);
  }

  public DameHistorialDeUnPuntoEquipo(equipoJuegoDePuntosId: number, puntoId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.get<HistorialPuntosEquipo[]>(this.APIUrlHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
      + equipoJuegoDePuntosId + '&filter[where][puntoId]=' + puntoId);
  }

  public DameHistorialPuntosEquipo(equipoJuegoDePuntosId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.get<HistorialPuntosEquipo[]>(this.APIUrlHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
      + equipoJuegoDePuntosId);
  }

  // tslint:disable-next-line:max-line-length
  public PonPuntosEquiposJuegoDePuntos(equipoJuegoDePuntos: EquipoJuegoDePuntos, equipoJuegoDePuntosId: number): Observable<EquipoJuegoDePuntos> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDePuntos>(this.APIUrlEquipoJuegoDePuntos + '/' + equipoJuegoDePuntosId, equipoJuegoDePuntos);
  }

  public PonHistorialPuntosEquipo(historial: HistorialPuntosEquipo): Observable<HistorialPuntosEquipo> {
    return this.http.post<HistorialPuntosEquipo>(this.APIUrlHistorialPuntosEquipo, historial);
  }

  public BorraPuntosEquipo(historialPuntosEquipoId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.delete<HistorialPuntosEquipo[]>(this.APIUrlHistorialPuntosEquipo + '/' + historialPuntosEquipoId);
  }


  ///////////////////////////////////////// GESTION DE JUEGO DE COLECCION //////////////////////////////////////////////////

  public DameJuegoDeColeccion(juegoDeColeccionID: number): Observable<Juego> {
    return this.http.get<Juego>(this.APIUrlJuegoDeColeccion + '/' + juegoDeColeccionID);
  }

  public CreaJuegoDeColeccion(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions', juego);
  }

  // public CambiaEstadoJuegoDeColeccion(juegoDeColeccion: Juego, juegoDeColeccionId: number, grupoId: number): Observable<Juego> {
  //   return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoDeColeccionId, juegoDeColeccion);
  // }

  public CambiaEstadoJuegoDeColeccion(juego: Juego): Observable<Juego> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Juego>(this.APIUrlJuegoDeColeccion + '/' + juego.id , juego);
  }

  public BorraJuegoDeColeccion(juegoDeColeccionId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDeColeccion + '/' + juegoDeColeccionId);
  }

  public DameJuegoDeColeccionGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions');
  }

  public CompletaJuegoDeColeccion(juego: Juego, grupoId: number, juegoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoId, juego);
  }

  public InscribeAlumnoJuegoDeColeccion(alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion) {
    return this.http.post<AlumnoJuegoDeColeccion>(this.APIUrlAlumnoJuegoDeColeccion, alumnoJuegoDeColeccion);
  }

  public InscribeEquipoJuegoDeColeccion(equipoJuegoDeColeccion: EquipoJuegoDeColeccion) {
    return this.http.post<EquipoJuegoDeColeccion>(this.APIUrlEquipoJuegoDeColeccion, equipoJuegoDeColeccion);
  }

  ///////////////////////////////////////// GESTION DE JUEGO DE COLECCIÓN INDIVIDUAL //////////////////////////////////////////////////

  public DameAlumnosJuegoDeColeccion(juegoDeColeccionId: number): Observable<Alumno[]> {
 
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeColeccion + '/' + juegoDeColeccionId + '/alumnos');
  }

  public DameInscripcionesAlumnoJuegoDeColeccion(juegoDeColeccionId: number): Observable<AlumnoJuegoDeColeccion[]> {
    return this.http.get<AlumnoJuegoDeColeccion[]>(this.APIUrlAlumnoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
      + juegoDeColeccionId);
  }

  public BorraInscripcionAlumnoJuegoDeColeccion(inscripcionId: number) {
    const url = this.APIUrlAlumnoJuegoDeColeccion + '/' + inscripcionId;
    console.log ('Voy a borrar ', url);
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIUrlAlumnoJuegoDeColeccion + '/' + inscripcionId);
  }

  public AsignarCromoAlumno(album: Album) {
    return this.http.post<Album>(this.APIUrlAlbum, album);
  }

  public DameCromosAlumno(alumnoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlAlumnoJuegoDeColeccion + '/' + alumnoJuegoDeColeccionId + '/cromos');
  }


  // Una cosa es obtener los cromos (funcion anterior) y otra es obtener las asignacionese
  // de cromos (esta función) que retorna una lista de objetos de tipo Album (nombre muy poco
  // apropiado para esto)

  public DameAsignacionesCromosAlumno(inscripcionAlumnoId: number): Observable<Album[]> {
    return this.http.get<Album[]>(this.APIUrlAlbum + '?filter[where][alumnoJuegoDeColeccionId]='
      + inscripcionAlumnoId);
  }

  // Esta es para obtener las asignaciones de un cromo concreto
  public DameAsignacionesCromoConcretoAlumno(inscripcionAlumnoId: number, cromoId: number): Observable<Album[]> {
    return this.http.get<Album[]>(this.APIUrlAlbum + '?filter[where][alumnoJuegoDeColeccionId]='
      + inscripcionAlumnoId + '&filter[where][cromoId]=' + cromoId);
  }


  public BorrarAsignacionCromoAlumno(albumId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIUrlAlbum + '/' + albumId);
  }


  ////////////////////////////////////// GESTION DE JUEGO DE COLECCION POR EQUIPOS //////////////////////////////////
  public DameEquiposJuegoDeColeccion(juegoDeColeccionId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeColeccion + '/' + juegoDeColeccionId + '/equipos');
  }

  public DameInscripcionesEquipoJuegoDeColeccion(juegoDeColeccionId: number): Observable<EquipoJuegoDeColeccion[]> {
    return this.http.get<EquipoJuegoDeColeccion[]>(this.APIUrlEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
      + juegoDeColeccionId);
  }

  public BorraInscripcionEquipoJuegoDeColeccion(inscripcionId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIUrlEquipoJuegoDeColeccion + '/' + inscripcionId);
  }

  public AsignarCromoEquipo(album: AlbumEquipo) {
    return this.http.post<AlbumEquipo>(this.APIUrlAlbumEquipo, album);
  }

  public DameCromosEquipo(equipoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlEquipoJuegoDeColeccion + '/' + equipoJuegoDeColeccionId + '/cromos');
  }

  // Una cosa es obtener los cromos (funcion anterior) y otra es obtener las asignacionese
  // de cromos (esta función) que retorna una lista de objetos de tipo AlbumEquipo (nombre muy poco
  // apropiado para esto)

  public DameAsignacionesCromosEquipo(inscripcionEquipoId: number): Observable<AlbumEquipo[]> {
    return this.http.get<AlbumEquipo[]>(this.APIUrlAlbumEquipo + '?filter[where][alumnoJuegoDeColeccionId]='
      + inscripcionEquipoId);
  }

  public DameAsignacionesCromoConcretoEquipo(inscripcionEquipoId: number, cromoId: number): Observable<AlbumEquipo[]> {
    return this.http.get<AlbumEquipo[]>(this.APIUrlAlbumEquipo + '?filter[where][equipoJuegoDeColeccionId]='
      + inscripcionEquipoId + '&filter[where][cromoId]=' + cromoId);
  }

  public BorrarAsignacionCromoEquipo(albumId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIUrlAlbumEquipo + '/' + albumId);
  }


  /////////////////////////////////////// GESTION JUEGOS DE COMPETICION /////////////////////////////////

  public DameJuegoDeCompeticionGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeCompeticions');
  }

  /////////////////////////////////////// GESTION JUEGOS DE COMPETICION TIPO LIGA /////////////////////////////////

  public DameJuegoDeCompeticionLiga(juegoDeCompeticionLigaID: number): Observable<Juego> {
    return this.http.get<Juego>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionLigaID);
  }

  public CreaJuegoDeCompeticionLiga(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga', juego);
  }

  public DameJuegoDeCompeticionLigaGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga');
  }


  public CambiaEstadoJuegoDeCompeticionLiga(juego: Juego): Observable<Juego> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Juego>(this.APIUrlJuegoDeCompeticionLiga + '/' + juego.id , juego);
  }

  public BorraJuegoDeCompeticionLiga(juegoDeCompeticionId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionId);
  }


  // jornadas juego de competición liga
  public CrearJornadasLiga(jornadasDeCompeticionLiga: Jornada,
    juegoDeCompeticionID: number): Observable<Jornada> {
    return this.http.post<Jornada>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionID + '/JornadasDeCompeticionLiga',
      jornadasDeCompeticionLiga);
  }

  // jornadas juego de competición liga
  public BorrarJornadaLiga(jornadaDeCompeticionLiga: Jornada): Observable<Jornada> {
    return this.http.delete<Jornada>(this.APIUrlJornadasJuegoDeCompeticionLiga + '/' + jornadaDeCompeticionLiga.id);

  }

  public ModificarJornada(JornadaNueva: Jornada, JornadaId: number): Observable<Jornada> {
    return this.http.patch<Jornada>(this.APIUrlJornadasJuegoDeCompeticionLiga + '/' + JornadaId, JornadaNueva);
  }

  public DameJornadasDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(this.APIUrlJornadasJuegoDeCompeticionLiga + '?filter[where][JuegoDeCompeticionLigaId]='
      + juegoDeCompeticionLigaId);
  }

  public DameEnfrentamientosDeCadaJornadaLiga(jornadasDeCompeticionLigaId: number): Observable<Array<EnfrentamientoLiga>> {
    return this.http.get<Array<EnfrentamientoLiga>>(this.APIUrlJornadasJuegoDeCompeticionLiga + '/' + jornadasDeCompeticionLigaId +
      '/enfrentamientosLiga');
  }

  public CrearEnrentamientoLiga(enfrentamiento: EnfrentamientoLiga, jornadasDeCompeticionLigaId: number): Observable<EnfrentamientoLiga> {
    return this.http.post<EnfrentamientoLiga>(this.APIUrlJornadasJuegoDeCompeticionLiga + '/' + jornadasDeCompeticionLigaId +
      '/enfrentamientosLiga', enfrentamiento);
  }

  public BorraEnfrentamientoLiga(enfrentamiento: EnfrentamientoLiga): Observable<EnfrentamientoLiga> {
    return this.http.delete<EnfrentamientoLiga>(this.APIUrlEnfrentamientosLiga + '/' + enfrentamiento.id);
  }

  public PonGanadorDelEnfrentamiento(enfrentamiento: EnfrentamientoLiga): Observable<EnfrentamientoLiga> {
    return this.http.put<EnfrentamientoLiga>(this.APIUrlEnfrentamientosLiga + '/' + enfrentamiento.id, enfrentamiento);
  }


  ///////////////////////////////// GESTION COMPETICION LIGA INDIVIDUAL //////////////////////////////////////////////////////////
  public DameAlumnosJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Alumno[]> {

    return this.http.get<Alumno[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionLigaId + '/alumnos');
  }

  public InscribeAlumnoJuegoDeCompeticionLiga(alumnoJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga) {
    return this.http.post<AlumnoJuegoDeCompeticionLiga>(this.APIUrlAlumnoJuegoDeCompeticionLiga, alumnoJuegoDeCompeticionLiga);
  }

  public BorraInscripcionAlumnoJuegoDeCompeticionLiga(inscripcionId: number) {
    return this.http.delete<AlumnoJuegoDeCompeticionLiga>(this.APIUrlAlumnoJuegoDeCompeticionLiga + '/' + inscripcionId);
  }

  public DameInscripcionesAlumnoJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<AlumnoJuegoDeCompeticionLiga[]> {
    return this.http.get<AlumnoJuegoDeCompeticionLiga[]>(this.APIUrlAlumnoJuegoDeCompeticionLiga
      + '?filter[where][JuegoDeCompeticionLigaId]=' + juegoDeCompeticionLigaId);
  }

  // tslint:disable-next-line:max-line-length
  public PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnoGanadorJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga): Observable<AlumnoJuegoDeCompeticionLiga> {
    return this.http.put<AlumnoJuegoDeCompeticionLiga>(this.APIUrlAlumnoJuegoDeCompeticionLiga + '/'
      + alumnoGanadorJuegoDeCompeticionLiga.id, alumnoGanadorJuegoDeCompeticionLiga);
  }

  //////////////////////////////////// GESITON COMPETICION LIGA POR EQUIPOS ///////////////////////////////////////////////////////
  public DameEquiposJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionLigaId + '/equipos');
  }

  public DameInscripcionesEquipoJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<EquipoJuegoDeCompeticionLiga[]> {
    return this.http.get<EquipoJuegoDeCompeticionLiga[]>(this.APIUrlEquipoJuegoDeCompeticionLiga
      + '?filter[where][JuegoDeCompeticionLigaId]=' + juegoDeCompeticionLigaId);
  }


  public BorraInscripcionEquipoJuegoDeCompeticionLiga(inscripcionId: number) {
    return this.http.delete<EquipoJuegoDeCompeticionLiga>(this.APIUrlEquipoJuegoDeCompeticionLiga + '/' + inscripcionId);
  }

  public InscribeEquipoJuegoDeCompeticionLiga(equipoJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga) {
    return this.http.post<EquipoJuegoDeCompeticionLiga>(this.APIUrlEquipoJuegoDeCompeticionLiga, equipoJuegoDeCompeticionLiga);
  }

  // tslint:disable-next-line:max-line-length
  public PonPuntosEquipoGanadorJuegoDeCompeticionLiga(ganadorJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga): Observable<EquipoJuegoDeCompeticionLiga> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDeCompeticionLiga>(this.APIUrlEquipoJuegoDeCompeticionLiga + '/' + ganadorJuegoDeCompeticionLiga.id, ganadorJuegoDeCompeticionLiga);
  }

  /////////////////////////// GESTION JUEGO DE COMPETICION TIPO FORMULA 1 ////////////////////////////

  public DameJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoID: number): Observable<Juego> {
    return this.http.get<Juego>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionFormulaUnoID);
  }

  public CreaJuegoDeCompeticionFormulaUno(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionFormulaUno', juego);
  }

  public DameJuegoDeCompeticionFormulaUnoGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionFormulaUno');
  }

  public BorraJuegoDeCompeticionFormulaUno(juegoDeCompeticionId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionId);
  }

  public ModificaJuegoDeCompeticionFormulaUno(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.patch<Juego>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + grupoId, juego);
  }


  public CambiaEstadoJuegoDeCompeticionFormulaUno(juego: Juego): Observable<Juego> {

    // tslint:disable-next-line:max-line-length
    return this.http.put<Juego>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juego.id , juego);
  }

  public CrearJornadasFormulaUno(JornadasDeCompeticionFormulaUno: Jornada, juegoDeCompeticionID: number): Observable<Jornada> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Jornada>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionID + '/JornadasDeCompeticionFormulaUno',
      JornadasDeCompeticionFormulaUno);

  }

  public ModificarJornadaFormulaUno(JornadaNueva: Jornada, JornadaId: number): Observable<Jornada> {
    return this.http.patch<Jornada>(this.APIUrlJornadasJuegoDeCompeticionFormulaUno + '/' + JornadaId, JornadaNueva);
  }


  public DameJornadasDeCompeticionFormulaUno(juegoDeCompeticionId: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionId
      + '/jornadasDeCompeticionFormulaUno');
  }

  public ActualizaGanadoresJornadasDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionFormulaUnoId
      + '/jornadasDeCompeticionFormulaUno');
  }

  public PonGanadoresJornadasDeCompeticionFormulaUno(jornada: Jornada): Observable<Jornada> {
    return this.http.put<Jornada>(this.APIUrlJornadasJuegoDeCompeticionFormulaUno + '/' + jornada.id, jornada);
  }

  public BorrarJornadaFormulaUno(jornadaDeCompeticionFormulaUno: Jornada): Observable<Jornada> {
    return this.http.delete<Jornada>(this.APIUrlJornadasJuegoDeCompeticionFormulaUno + '/' + jornadaDeCompeticionFormulaUno.id);

  }

  ////////////////////////////////// GESTION COMPETICION FORMULA 1 INDIVIDUAL /////////////////////////////////////////////////////////

  public DameAlumnosJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<Alumno[]> {

    return this.http.get<Alumno[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionFormulaUnoId + '/alumnos');
  }

  public InscribeAlumnoJuegoDeCompeticionFormulaUno(alumnoJuegoDeCompeticionFormulaUno: AlumnoJuegoDeCompeticionFormulaUno) {
    return this.http.post<AlumnoJuegoDeCompeticionFormulaUno>(this.APIUrlAlumnoJuegoDeCompeticionFormulaUno,
      alumnoJuegoDeCompeticionFormulaUno);
  }


  // tslint:disable-next-line:max-line-length
  public DameInscripcionesAlumnoJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<AlumnoJuegoDeCompeticionFormulaUno[]> {
    return this.http.get<AlumnoJuegoDeCompeticionFormulaUno[]>(this.APIUrlAlumnoJuegoDeCompeticionFormulaUno
      + '?filter[where][JuegoDeCompeticionFormulaUnoId]=' + juegoDeCompeticionFormulaUnoId);
  }

  public BorraInscripcionAlumnoJuegoDeCompeticionFormulaUno(alumnoJuegoDeCompeticionFormulaUnoId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete<AlumnoJuegoDeCompeticionFormulaUno>(this.APIUrlAlumnoJuegoDeCompeticionFormulaUno + '/' + alumnoJuegoDeCompeticionFormulaUnoId);
  }


  // tslint:disable-next-line:max-line-length
  public PonPuntosAlumnoGanadorJornadasDeCompeticionFormulaUno(alumno: AlumnoJuegoDeCompeticionFormulaUno): Observable<AlumnoJuegoDeCompeticionFormulaUno> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDeCompeticionFormulaUno>(this.APIUrlAlumnoJuegoDeCompeticionFormulaUno + '/' + alumno.id, alumno);
  }

  //////////////////////////////////////// GESTION JUEGO COMPETICION FORMULA 1 POR EQUIPOS ///////////////////////////////////////

  public DameEquiposJuegoDeCompeticionFormulaUno(juegoDeCompeticionLigaId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionLigaId + '/equipos');
  }

  public InscribeEquipoJuegoDeCompeticionFormulaUno(equipoJuegoDeCompeticionFormulaUno: EquipoJuegoDeCompeticionFormulaUno) {
    return this.http.post<EquipoJuegoDeCompeticionFormulaUno>(this.APIUrlEquipoJuegoDeCompeticionFormulaUno,
      equipoJuegoDeCompeticionFormulaUno);
  }

  // tslint:disable-next-line:max-line-length
  public DameInscripcionesEquipoJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<EquipoJuegoDeCompeticionFormulaUno[]> {
    return this.http.get<EquipoJuegoDeCompeticionFormulaUno[]>(this.APIUrlEquipoJuegoDeCompeticionFormulaUno
      + '?filter[where][JuegoDeCompeticionFormulaUnoId]=' + juegoDeCompeticionFormulaUnoId);
  }

  public BorraInscripcionEquipoJuegoDeCompeticionFormulaUno(equipoJuegoDeCompeticionFormulaUnoId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete<EquipoJuegoDeCompeticionLiga>(this.APIUrlEquipoJuegoDeCompeticionFormulaUno + '/' + equipoJuegoDeCompeticionFormulaUnoId);
  }

  // tslint:disable-next-line:max-line-length
  public PonPuntosEquipoGanadorJornadasDeCompeticionFormulaUno(equipo: EquipoJuegoDeCompeticionFormulaUno): Observable<EquipoJuegoDeCompeticionFormulaUno> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDeCompeticionFormulaUno>(this.APIUrlEquipoJuegoDeCompeticionFormulaUno + '/' + equipo.id, equipo);
  }

//////////////////////////////////////// GESTION JUEGO COMPETICION TORNEO ///////////////////////////////////////

public CreaJuegoDeCompeticionTorneo(juego: Juego, grupoId: number): Observable<Juego> {
  return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeCompeticionTorneo', juego);
}

public CrearEnfrentamientoTorneo(enfrentamiento: EnfrentamientoTorneo, jornadasDeCompeticionTorneoId: number): Observable<EnfrentamientoTorneo> {
    return this.http.post<EnfrentamientoTorneo>(this.APIUrlJornadasJuegoDeCompeticionTorneo + '/' + jornadasDeCompeticionTorneoId +
      '/enfrentamientosTorneo', enfrentamiento);
}

public BorraEnfrentamientoTorneo(enfrentamiento: EnfrentamientoTorneo): Observable<EnfrentamientoTorneo> {
  return this.http.delete<EnfrentamientoTorneo>(this.APIUrlEnfrentamientosTorneo + '/' + enfrentamiento.id);
}

public CambiaEstadoJuegoDeCompeticionTorneo(juego: Juego): Observable<Juego> {
  // tslint:disable-next-line:max-line-length
  return this.http.put<Juego>(this.APIUrlJuegoDeCompeticionTorneo + '/' + juego.id , juego);
}


public CrearJornadasTorneo(jornadasDeCompeticionTorneo: Jornada,
  juegoDeCompeticionTorneoID: number): Observable<Jornada> {
return this.http.post<Jornada>(this.APIUrlJuegoDeCompeticionTorneo + '/' + juegoDeCompeticionTorneoID + '/JornadasDeCompeticionTorneo',
jornadasDeCompeticionTorneo);
}
public DameJornadasDeCompeticionTorneo(juegoDeCompeticionTorneoId: number): Observable<Jornada[]> {
  return this.http.get<Jornada[]>(this.APIUrlJornadasJuegoDeCompeticionTorneo + '?filter[where][JuegoDeCompeticionTorneoId]='
    + juegoDeCompeticionTorneoId);
}

public ModificarJornadaTorneo(JornadaNueva: Jornada, JornadaId: number): Observable<Jornada> {
  return this.http.patch<Jornada>(this.APIUrlJornadasJuegoDeCompeticionTorneo + '/' + JornadaId, JornadaNueva);
}

public DameEnfrentamientosDeCadaJornadaTorneo(jornadasDeCompeticionTorneoId: number): Observable<Array<EnfrentamientoTorneo>> {
  return this.http.get<Array<EnfrentamientoTorneo>>(this.APIUrlJornadasJuegoDeCompeticionTorneo + '/' + jornadasDeCompeticionTorneoId +
    '/enfrentamientosTorneo');
}
public PonGanadorDelEnfrentamientoTorneo(enfrentamiento: EnfrentamientoTorneo): Observable<EnfrentamientoTorneo> {
  return this.http.put<EnfrentamientoTorneo>(this.APIUrlEnfrentamientosTorneo + '/' + enfrentamiento.id, enfrentamiento);
}
public BorrarJornadaTorneo(jornadasDeCompeticionTorneo: Jornada): Observable<Jornada> {
  return this.http.delete<Jornada>(this.APIUrlJornadasJuegoDeCompeticionTorneo + '/' + jornadasDeCompeticionTorneo.id);

}
public DameJuegoDeCompeticionTorneoGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionTorneo');
}

public BorraJuegoDeCompeticionTorneo(juegoDeCompeticionId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDeCompeticionTorneo + '/' + juegoDeCompeticionId);
}
  ////////////////////////////////// GESTION COMPETICION TORNEO INDIVIDUAL /////////////////////////////////////////////////////////

public InscribeAlumnoJuegoDeCompeticionTorneo(alumnoJuegoDeCompeticionTorneo: AlumnoJuegoDeCompeticionTorneo) {
  return this.http.post<AlumnoJuegoDeCompeticionTorneo>(this.APIUrlAlumnoJuegoDeCompeticionTorneo, alumnoJuegoDeCompeticionTorneo);
}

public DameAlumnosJuegoDeCompeticionTorneo(juegoDeCompeticionTorneoId: number): Observable<Alumno[]> {
  console.log('Voy a por los alumnos');
  return this.http.get<Alumno[]>(this.APIUrlJuegoDeCompeticionTorneo + '/' + juegoDeCompeticionTorneoId + '/alumnos');
}

public DameInscripcionesAlumnoJuegoDeCompeticionTorneo(juegoDeCompeticionTorneoId: number): Observable<AlumnoJuegoDeCompeticionTorneo[]> {
  return this.http.get<AlumnoJuegoDeCompeticionTorneo[]>(this.APIUrlAlumnoJuegoDeCompeticionTorneo
    + '?filter[where][JuegoDeCompeticionTorneoId]=' + juegoDeCompeticionTorneoId);
}

public BorraInscripcionAlumnoJuegoDeCompeticionTorneo(inscripcionId: number) {
  return this.http.delete<AlumnoJuegoDeCompeticionTorneo>(this.APIUrlAlumnoJuegoDeCompeticionTorneo + '/' + inscripcionId);
}
////////////////////////////////// GESTION COMPETICION TORNEO POR EQUIPOS /////////////////////////////////////////////////////////
public InscribeEquipoJuegoDeCompeticionTorneo(equipoJuegoDeCompeticionTorneo: EquipoJuegoDeCompeticionTorneo) {
  return this.http.post<EquipoJuegoDeCompeticionTorneo>(this.APIUrlEquipoJuegoDeCompeticionTorneo, equipoJuegoDeCompeticionTorneo);
}

public DameEquiposJuegoDeCompeticionTorneo(juegoDeCompeticionTorneoId: number): Observable<Equipo[]> {
  return this.http.get<Equipo[]>(this.APIUrlJuegoDeCompeticionTorneo + '/' + juegoDeCompeticionTorneoId + '/equipos');
}

public DameInscripcionesEquipoJuegoDeCompeticionTorneo(juegoDeCompeticionTorneoId: number): Observable<EquipoJuegoDeCompeticionTorneo[]> {
  return this.http.get<EquipoJuegoDeCompeticionTorneo[]>(this.APIUrlEquipoJuegoDeCompeticionTorneo
    + '?filter[where][JuegoDeCompeticionTorneoId]=' + juegoDeCompeticionTorneoId);
}

public BorraInscripcionEquipoJuegoDeCompeticionTorneo(inscripcionId: number) {
  return this.http.delete<EquipoJuegoDeCompeticionTorneo>(this.APIUrlEquipoJuegoDeCompeticionTorneo + '/' + inscripcionId);
}

  /////////////////////////////// GESTION DE PREGUNTAS /////////////////////////////

  public CreaPregunta(pregunta: Pregunta, profesorId: number): Observable<Pregunta> {

    return this.http.post<Pregunta>(this.APIUrlProfesores + '/' + profesorId + '/preguntas', pregunta);
  }

  public DameTodasMisPreguntas(profesorId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.APIUrlProfesores + '/' + profesorId + '/preguntas');
  }

  public BorrarPregunta(preguntaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlPreguntas + '/' + preguntaId);
  }

  public ModificaPregunta(pregunta: Pregunta, profesorId: number, preguntaId: number): Observable<Pregunta> {
    return this.http.put<Pregunta>(this.APIUrlProfesores + '/' + profesorId + '/preguntas/' + preguntaId, pregunta);
  }

  public PonImagenPregunta(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenesPreguntas + '/upload', formData);
  }

  public BorrarImagenPregunta(imagen: string): Observable<any> {
    return this.http.delete<any>(this.APIUrlImagenesPreguntas + '/files/' + imagen);
  }

  public DameImagenPregunta(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenesPreguntas + '/download/' + imagen,
      { responseType: 'blob' });
  }


  //////////////////////////// GESTION DE CUESTIONARIOS /////////////////////////////
  public CreaCuestionario(cuestionario: Cuestionario, profesorId: number): Observable<Cuestionario> {

    return this.http.post<Cuestionario>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios', cuestionario);
  }

  public DameCuestionario(cuestionarioId: number): Observable<Cuestionario> {
    return this.http.get<Cuestionario>(this.APIUrlCuestionarios + '/' + cuestionarioId);
  }

  public ModificaCuestionario(cuestionario: Cuestionario, profesorId: number, cuestionarioId: number): Observable<Cuestionario> {
    return this.http.put<Cuestionario>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios/' + cuestionarioId, cuestionario);
  }

  public DameTodosMisCuestionarios(profesorId: number): Observable<Cuestionario[]> {
    return this.http.get<Cuestionario[]>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios');
  }

  public DameCuestionariosPublicos(): Observable<Cuestionario[]> {
    return this.http.get<Cuestionario[]>(this.APIUrlCuestionarios
      + '?filter[where][Publico]=true');
  }

  public BorraCuestionario(profesorId: number, cuestionarioId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios/' + cuestionarioId);
  }

  public DamePreguntasCuestionario(cuestionarioId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.APIUrlCuestionarios + '/' + cuestionarioId + '/Preguntas');
  }

  public PreguntasEnCuestionario(preguntaDelCuestionario: PreguntaDelCuestionario): Observable<PreguntaDelCuestionario> {
    return this.http.post<PreguntaDelCuestionario>(this.APIUrlPreguntaDelCuestionario, preguntaDelCuestionario);
  }

  public DamePreguntaDelCuestionario(preguntaId: number, cuestionarioId: number): Observable<PreguntaDelCuestionario> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<PreguntaDelCuestionario>(this.APIUrlPreguntaDelCuestionario + '?filter[where][cuestionarioId]=' + cuestionarioId + '&filter[where][preguntaId]=' + preguntaId);
  }

  public BorraPreguntaDelCuestionario(preguntaDelCuestionatioId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlPreguntaDelCuestionario + '/' + preguntaDelCuestionatioId);
  }

  public DameAsignacionesPreguntasACuestionario(cuestionarioId: number): Observable<PreguntaDelCuestionario[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<PreguntaDelCuestionario[]>(this.APIUrlPreguntaDelCuestionario + '?filter[where][cuestionarioId]=' + cuestionarioId);
  }

  public DameCuestionariosConPregunta(preguntaId: number): Observable<PreguntaDelCuestionario[]> {
    return this.http.get<PreguntaDelCuestionario[]>(this.APIUrlPreguntaDelCuestionario + '?filter[where][preguntaId]=' + preguntaId);
  }

  //////////////////////////////// GESTION DE JUEGOS DE CUESTIONARIO/////////////////

  public DameJuegoDeCuestionarioPorID(juegoDeCuestionarioID: number): Observable<JuegoDeCuestionario> {
    return this.http.get<JuegoDeCuestionario>(this.APIUrlJuegoDeCuestionario + '/' + juegoDeCuestionarioID);
  }

  public CreaJuegoDeCuestionario(juegoDeCuestionario: JuegoDeCuestionario, grupoId: number): Observable<JuegoDeCuestionario> {
    return this.http.post<JuegoDeCuestionario>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeCuestionario', juegoDeCuestionario);
  }

  public DameJuegoDeCuestionario(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeCuestionario');
  }

 
  public ModificaJuegoDeCuestionario(juego: JuegoDeCuestionario, id: number): Observable<JuegoDeCuestionario> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeCuestionario>(this.APIUrlJuegoDeCuestionario + '/' + id , juego);
  }

  public BorrarJuegoDeCuestionario(juegoDeCuestionarioId: number): Observable<any> {
   
    return this.http.delete<any>(this.APIUrlJuegoDeCuestionario + '/' + juegoDeCuestionarioId);
  }

  //////////////////////////////// GESTION DE ALUMNOS EN JUEGOS DE CUESTIONARIO/////////////////

  public InscribeAlumnoJuegoDeCuestionario(alumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario) {
    return this.http.post<AlumnoJuegoDeCuestionario>(this.APIUrlAlumnoJuegoDeCuestionario, alumnoJuegoDeCuestionario);
  }

  public DameAlumnosJuegoDeCuestionario(juegoDeCuestionario: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeCuestionario + '/' + juegoDeCuestionario + '/alumnos');
  }
  public DameEquiposJuegoDeCuestionario(juegoDeCuestionario: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeCuestionario + '/' + juegoDeCuestionario + '/equipos');
  }

  public DameInscripcionesAlumnoJuegoDeCuestionario(juegoDeCuestionarioId: number): Observable<AlumnoJuegoDeCuestionario[]> {
    return this.http.get<AlumnoJuegoDeCuestionario[]>(this.APIUrlAlumnoJuegoDeCuestionario
      + '?filter[where][juegoDeCuestionarioId]=' + juegoDeCuestionarioId);
  }
  public DameInscripcionesEquipoJuegoDeCuestionario(juegoDeCuestionarioId: number): Observable<EquipoJuegoDeCuestionario[]> {
    return this.http.get<EquipoJuegoDeCuestionario[]>(this.APIUrlEquipoJuegoDeCuestionario
      + '?filter[where][juegoDeCuestionarioId]=' + juegoDeCuestionarioId);
  }

  public DameRespuestasAlumnoJuegoDeCuestionario(alumnoJuegoDeCuestionarioId: number): Observable<RespuestaJuegoDeCuestionario[]> {
    return this.http.get<RespuestaJuegoDeCuestionario[]>(this.APIUrlRespuestasJuegoDeCuestionario
      + '?filter[where][alumnoJuegoDeCuestionarioId]=' + alumnoJuegoDeCuestionarioId);
  }

  public BorraRespuestaAlumnoDelJuegoDeCuestionario(respuestaId: number) {
    return this.http.delete<any>(this.APIUrlRespuestasJuegoDeCuestionario + '/' + respuestaId);
  }

  // tslint:disable-next-line:max-line-length
  public PonerNotaAlumnoJuegoDeCuestionario(alumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario, alumnoJuegoDeCuestionarioId: number): Observable<AlumnoJuegoDeCuestionario> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDeCuestionario>(this.APIUrlAlumnoJuegoDeCuestionario + '/' + alumnoJuegoDeCuestionarioId, alumnoJuegoDeCuestionario);
  }

  public BorraAlumnoDelJuegoDeCuestionario(alumnoJuegoDeCuestionarioId: number): Observable<any> {
    const url = this.APIUrlAlumnoJuegoDeCuestionario + '/' + alumnoJuegoDeCuestionarioId;
    console.log ('VOY A BORRAR ', url);
    return this.http.delete<any>(this.APIUrlAlumnoJuegoDeCuestionario + '/' + alumnoJuegoDeCuestionarioId);
  }

  public DameRespuestasEquipoJuegoDeCuestionario(equipoJuegoDeCuestionarioId: number): Observable<RespuestaEquipoJuegoDeCuestionario[]> {
    return this.http.get<RespuestaEquipoJuegoDeCuestionario[]>(this.APIUrlRespuestasEquipoJuegoDeCuestionario
      + '?filter[where][equipoJuegoDeCuestionarioId]=' + equipoJuegoDeCuestionarioId);
  }

  public BorraRespuestaEquipoDelJuegoDeCuestionario(respuestaId: number) {
    return this.http.delete<any>(this.APIUrlRespuestasEquipoJuegoDeCuestionario + '/' + respuestaId);
  }

  public BorraEquipoDelJuegoDeCuestionario(equipoJuegoDeCuestionarioId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlEquipoJuegoDeCuestionario + '/' + equipoJuegoDeCuestionarioId);
  }





  public InscribeEquipoJuegoDeCuestionario(equipoJuegoDeCuestionario: EquipoJuegoDeCuestionario) {
    return this.http.post<EquipoJuegoDeCuestionario>(this.APIUrlEquipoJuegoDeCuestionario, equipoJuegoDeCuestionario);
  }

  /////////////////////////////////////// GESTION DE ESCENARIOS ////////////////////////

  public CreaEscenario(escenario: Escenario, profesorId: number): Observable<Escenario> {
    
    return this.http.post<Escenario>(this.APIUrlProfesores + '/' + profesorId + '/escenarios', escenario);
  }

  public ModificaEscenario(escenario: Escenario, profesorId: number, idescenario: number): Observable<Escenario> {
    return this.http.put<Escenario>(this.APIUrlProfesores + '/' + profesorId + '/escenarios/' + idescenario, escenario);
  }

  // public DameTodosMisEscenarios(profesorId: number): Observable<Escenario[]> {
  //   return this.http.get<Escenario[]>(this.APIUrlProfesores + '/' + profesorId + '/escenarios');
  // }

  public DameEscenariosDelProfesor(profesorId: number): Observable<Escenario[]> {
    return this.http.get<Escenario[]>(this.APIUrlProfesores + '/' + profesorId + '/escenarios');
  }

  public BorraEscenario(idescenario: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/escenarios/' + idescenario);
  }

  public PonPuntoGeolocalizableEscenario(puntogeolocalizable: PuntoGeolocalizable, idescenario: number): Observable<PuntoGeolocalizable> {
    return this.http.post<PuntoGeolocalizable>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables', puntogeolocalizable);
  }

  public BorrarPuntoGeolocalizable(idpuntogeolocalizable: number, idescenario: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables/' + idpuntogeolocalizable);
  }

  public DameEscenario(idescenario: number): Observable<Escenario> {
    return this.http.get<Escenario>(this.APIUrlEscenarios + '/' + idescenario);
  }


  public DamePuntosGeolocalizablesEscenario(idescenario: number): Observable<PuntoGeolocalizable[]> {
    return this.http.get<PuntoGeolocalizable[]>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables');
  }

  // tslint:disable-next-line:max-line-length
  public ModificaPuntoGeolocalizableEscenario(puntogeolocalizable: PuntoGeolocalizable, idescenario: number, idpuntogeolocalizable: number): Observable<PuntoGeolocalizable> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<PuntoGeolocalizable>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables/' + idpuntogeolocalizable, puntogeolocalizable);
  }

  ////////////////////////////// GESTION DE JUEGOS DE GEOCACHING ////////////////////////////////////////

  public DameJuegoDeGeocachingPorID(juegoDeGeocachingID: number): Observable<JuegoDeGeocaching> {
    return this.http.get<JuegoDeGeocaching>(this.APIUrlJuegoDeGeocaching + '/' + juegoDeGeocachingID);
  }

  public CreaJuegoDeGeocaching(juegoDeGeocaching: JuegoDeGeocaching, grupoId: number): Observable<JuegoDeGeocaching> {
    return this.http.post<JuegoDeGeocaching>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeGeocaching', juegoDeGeocaching);
  }

  public ModificaJuegoDeGeocaching(JuegosDeGeocaching: JuegoDeGeocaching,
    juegoDeGeocachingId: number, grupoId: number): Observable<JuegoDeGeocaching> {
    return this.http.put<JuegoDeGeocaching>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeGeocaching/' + juegoDeGeocachingId,
      JuegosDeGeocaching);
  }

  public BorrarJuegoDeGeocaching(juegoDeGeocachingId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlJuegoDeGeocaching + '/' + juegoDeGeocachingId);
  }

  public DameJuegoDeGeocaching(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeGeocaching');
  }

  /////////////////////////////// GESTION DE ALUMNOS EN JUEGOS DE GEOCACHING //////////////////

  public DameAlumnosDelJuegoDeGeocaching(juegoDeGeocachingId: number): Observable<AlumnoJuegoDeGeocaching[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<AlumnoJuegoDeGeocaching[]>(this.APIUrlAlumnoJuegoDeGeocaching + '?filter[where][juegoDeGeocachingId]=' + juegoDeGeocachingId);
  }

  public BorraAlumnoDelJuegoDeGeocaching(alumnoJuegoDeGeocachingId: number): Observable<any> {
    let url = this.APIUrlAlumnoJuegoDeGeocaching + '/' + alumnoJuegoDeGeocachingId;
    console.log ('voy a borrar ', url);
    return this.http.delete<any>(this.APIUrlAlumnoJuegoDeGeocaching + '/' + alumnoJuegoDeGeocachingId);
  }

  public InscribeAlumnoJuegoDeGeocaching(alumnoJuegoDeGeocaching: AlumnoJuegoDeGeocaching) {
    return this.http.post<AlumnoJuegoDeGeocaching>(this.APIUrlAlumnoJuegoDeGeocaching, alumnoJuegoDeGeocaching);
  }

  public DameAlumnosJuegoDeGeocaching(juegoDeGeocaching: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeGeocaching + '/' + juegoDeGeocaching + '/alumnos');
  }

  public DameInscripcionesAlumnoJuegoDeGeocaching(juegoDeGeocachingId: number): Observable<AlumnoJuegoDeGeocaching[]> {
    return this.http.get<AlumnoJuegoDeGeocaching[]>(this.APIUrlAlumnoJuegoDeGeocaching
      + '?filter[where][juegoDeGeocachingId]=' + juegoDeGeocachingId);
  }


  ////////////////////////////// GESTION FAMILIAS DE AVATARES ////////////////////////////////////


  public CreaFamiliaAvatares(familia: FamiliaAvatares, profesorId: number): Observable<FamiliaAvatares> {
    return this.http.post<FamiliaAvatares>(this.APIUrlProfesores + '/' + profesorId + '/familiaAvatares', familia);
  }

  public DameFamiliasAvataresProfesor(profesorId: number): Observable<FamiliaAvatares[]> {
    return this.http.get<FamiliaAvatares[]>(this.APIUrlProfesores + '/' + profesorId + '/familiaAvatares');
  }


  public DameFamiliasAvataresPublicas(): Observable<FamiliaAvatares[]> {
    return this.http.get<FamiliaAvatares[]>(this.APIUrlFamiliarAvatares
      + '?filter[where][Publica]=true');
  }


  public DameFamilia(familiaId: number): Observable<FamiliaAvatares> {
    return this.http.get<FamiliaAvatares>(this.APIUrlFamiliarAvatares + '/' + familiaId);
  }

  public ModificaFamiliaAvatares(familia: FamiliaAvatares): Observable<FamiliaAvatares> {
    return this.http.put<FamiliaAvatares>(this.APIUrlFamiliarAvatares + '/' + familia.id, familia);
  }

  public BorraFamiliaAvatares(familiaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlFamiliarAvatares + '/' + familiaId);
  }

  public PonImagenAvatar(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenesAvatares + '/upload', formData);
  }

  public DameImagenAvatar(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenesAvatares + '/download/' + imagen,
      { responseType: 'blob' });
  }


  public BorrarImagenAvatar(imagen: string): Observable<any> {
    return this.http.delete<any>(this.APIUrlImagenesAvatares + '/files/' + imagen);
  }

  ////////////////////////////// GESTION JUEGO DE AVATARES ////////////////////////////////////

  public DameJuegoDeAvatar(juegoDeAvatarID: number): Observable<JuegoDeAvatar> {
    return this.http.get<JuegoDeAvatar>(this.APIUrlJuegoDeAvatar + '/' + juegoDeAvatarID);
  }

  public CreaJuegoDeAvatar(juego: JuegoDeAvatar, grupoId: number): Observable<JuegoDeAvatar> {
    return this.http.post<JuegoDeAvatar>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeAvatars', juego);
  }

  public BorraJuegoDeAvatar(juegoDeAvatarId: number): Observable<JuegoDeAvatar> {
    return this.http.delete<JuegoDeAvatar>(this.APIUrlJuegoDeAvatar + '/' + juegoDeAvatarId);
  }

  public ModificaJuegoDeAvatar(juego: Juego): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlJuegoDeAvatar + '/' + juego.id, juego);
  }

  public DameJuegoDeAvatarGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeAvatars');
  }


  public CambiaEstadoJuegoDeAvatar(juego: Juego): Observable<Juego> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + juego.grupoId + '/juegoDeAvatars/' + juego.id, juego);
  }


  //////////////////////////////// GESTION DE ALUMNOS EN JUEGO DE AVATAR //////////////

  public InscribeAlumnoJuegoDeAvatar(alumnoJuegoDeAvatar: AlumnoJuegoDeAvatar) {
    return this.http.post<AlumnoJuegoDeAvatar>(this.APIUrlAlumnoJuegoDeAvatar,
      alumnoJuegoDeAvatar);
  }

  public DameAlumnosJuegoDeAvatar(juegoDeAvatarId: number): Observable<Alumno[]> {

    return this.http.get<Alumno[]>(this.APIUrlJuegoDeAvatar + '/' + juegoDeAvatarId + '/alumnos');
  }

  // tslint:disable-next-line:max-line-length
  public DameInscripcionesAlumnoJuegoDeAvatar(juegoDeAvatarId: number): Observable<AlumnoJuegoDeAvatar[]> {
    return this.http.get<AlumnoJuegoDeAvatar[]>(this.APIUrlAlumnoJuegoDeAvatar
      + '?filter[where][juegoDeAvatarId]=' + juegoDeAvatarId);
  }

  public BorraInscripcionAlumnoJuegoDeAvatar(inscripcionId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete<AlumnoJuegoDeAvatar>(this.APIUrlAlumnoJuegoDeAvatar + '/' + inscripcionId);
  }

  public BorraAudioAvatar(audio: string): Observable<any> {
    return this.http.delete<any>(this.APIUrlAudiosAvatares + '/files/' + audio);
  }

  public ModificaInscripcionAlumnoJuegoDeAvatar(inscripcion: AlumnoJuegoDeAvatar): Observable<AlumnoJuegoDeAvatar> {
    return this.http.put<AlumnoJuegoDeAvatar>(this.APIUrlAlumnoJuegoDeAvatar + '/' + inscripcion.id, inscripcion);
  }

  //////////////////////////////// GESTION DE EQUIPOS EN JUEGO DE AVATAR /////////////////


//   /////////////////////////////// GESTION LIBROS //////////////////////////////////



//   public InscribeAlumnojuegoDelibro(alumnoJuegoDeLibro: AlumnoJuegoDeLibro, id) {
//     return this.http.post<AlumnoJuegoDeLibro>(this.APIUrlJuegodeLibro + '/' + id  + '/alumnojuegodecuento',
//       alumnoJuegoDeLibro);

//   }
//   public crearjuegolibro(juego: JuegoDeLibros, grupoId: number) {

//     return this.http.post<JuegoDeLibros>(this.APIUrlGrupos + '/' + grupoId + '/juegodelibro', juego);
//   }


//    public DamejuegosdeCuento(grupoId: number): Observable<Juego[]> {
//     return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegodelibro');
//   }

//   public DameAlumnosJuegoLibro(id): Observable<any>  {
//   return this.http.get<AlumnoJuegoDeLibro>(this.APIUrlJuegodeLibro + '/' + id + '/alumnojuegodecuento');

//  }


//  public ModificarPermidosJuegoLibro(alumno: AlumnoJuegoDeLibro, id): Observable<AlumnoJuegoDeLibro> {
//   return this.http.put<AlumnoJuegoDeLibro>(this.APIUrlJuegodeLibro + '/' + id + '/alumnojuegodecuento/' + alumno.id, alumno);
// }



//   public crearCarpeta(nombre: any): Observable<any> {

//     return this.http.post<any>(this.APIurlImagenesLibros, nombre);
//   }

//   public guardarImagenRecursoLibro(nombre: any, file: FormData): Observable<any> {
//     return this.http.post<any>(this.APIurlImagenesLibros + '/' + nombre + '/upload', file);
//   }
//   // public guardarRecursoLibro(recurso: any):Observable<any>{
//   //   return this.http.post<any>(this.APIurlRecursosLibros, recurso);
//   // }

//   public guardarRecursoLibro(recurso: any, profesorId): Observable<any> {
//     return this.http.post<any>(  this.APIUrlProfesores + '/' + profesorId + '/recursosLibros', recurso);

//   }
   /////////////////////////////////////// GESTION JUEGOS DE VOTACION: UNO A TODOS /////////////////////////////////



   // public CreaJuegoDeVotacionUnoATodos(juego: JuegoDeVotacionUnoATodos, grupoId: number): Observable<JuegoDeVotacionUnoATodos> {
  /////////////////////////////////////// GESTION JUEGOS DE VOTACION: UNO A TODOS /////////////////////////////////

  public DameJuegoDeVotacionUnoATodos(juegoDeVotacionUnoATodosID: number): Observable<JuegoDeVotacionUnoATodos> {
    return this.http.get<JuegoDeVotacionUnoATodos>(this.APIUrlJuegoDeVotacionUnoATodos + '/' + juegoDeVotacionUnoATodosID);
  }

  public CreaJuegoDeVotacionUnoATodos(juego: JuegoDeVotacionUnoATodos, grupoId: number): Observable<JuegoDeVotacionUnoATodos> {
    return this.http.post<JuegoDeVotacionUnoATodos>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeVotacionUnoATodos', juego);
  }

  public DameJuegosDeVotacionUnoATodos(grupoId: number): Observable<JuegoDeVotacionUnoATodos[]> {
    return this.http.get<JuegoDeVotacionUnoATodos[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeVotacionUnoATodos');
  }

  public BorraJuegoDeVotacionUnoATodos(juegoId: number): Observable<JuegoDeVotacionUnoATodos> {
    return this.http.delete<JuegoDeVotacionUnoATodos>(this.APIUrlJuegoDeVotacionUnoATodos + '/' + juegoId);
  }

  public CambiaEstadoJuegoDeVotacionUnaATodos(juego: JuegoDeVotacionUnoATodos): Observable<JuegoDeVotacionUnoATodos> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeVotacionUnoATodos>(this.APIUrlGrupos + '/' + juego.grupoId + '/juegoDeVotacionUnoATodos/' + juego.id, juego);
  }

  ////////////////////////////////// GESTION VOTACION UNO A TODOS INDIVIDUAL /////////////////////////////////////////////////////////

  public DameAlumnosJuegoDeVotacionUnoATodos(juegoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeVotacionUnoATodos + '/' + juegoId + '/alumnos');
  }

  public InscribeAlumnoJuegoDeVotacionUnoATodos(alumnoJuegoDeVotacionUnoATodos: AlumnoJuegoDeVotacionUnoATodos) {
    return this.http.post<AlumnoJuegoDeVotacionUnoATodos>(this.APIUrlAlumnoJuegoDeVotacionUnoATodos,
      alumnoJuegoDeVotacionUnoATodos);
  }


  // tslint:disable-next-line:max-line-length
  public DameInscripcionesAlumnoJuegoDeVotacionUnoATodos(juegoId: number): Observable<AlumnoJuegoDeVotacionUnoATodos[]> {
    return this.http.get<AlumnoJuegoDeVotacionUnoATodos[]>(this.APIUrlAlumnoJuegoDeVotacionUnoATodos
      + '?filter[where][juegoDeVotacionUnoATodosId]=' + juegoId);
  }

  public BorraInscripcionAlumnoJuegoDeVotacionUnoATodos(alumnoJuegoDeVotacionUnoATodosId: number) {
    const url = this.APIUrlAlumnoJuegoDeVotacionUnoATodos + '/' + alumnoJuegoDeVotacionUnoATodosId;

    // tslint:disable-next-line:max-line-length
    return this.http.delete<AlumnoJuegoDeVotacionUnoATodos>(this.APIUrlAlumnoJuegoDeVotacionUnoATodos + '/' + alumnoJuegoDeVotacionUnoATodosId);
  }


  // tslint:disable-next-line:max-line-length
  public ModificaInscripcionAlumnoJuegoDeVotacionUnoATodos(inscripcion: AlumnoJuegoDeVotacionUnoATodos): Observable<AlumnoJuegoDeVotacionUnoATodos> {
    return this.http.put<AlumnoJuegoDeVotacionUnoATodos>(this.APIUrlAlumnoJuegoDeVotacionUnoATodos + '/' + inscripcion.id, inscripcion);
  }


////////////////////////////////// GESTION VOTACION UNO A TODOS EQUIPOS /////////////////////////////////////////////////////////

public DameEquiposJuegoDeVotacionUnoATodos(juegoId: number): Observable<Equipo[]> {
  return this.http.get<Equipo[]>(this.APIUrlJuegoDeVotacionUnoATodos + '/' + juegoId + '/equipos');
}

public InscribeEquipoJuegoDeVotacionUnoATodos(equipoJuegoDeVotacionUnoATodos: EquipoJuegoDeVotacionUnoATodos) {
  return this.http.post<EquipoJuegoDeVotacionUnoATodos>(this.APIUrlEquipoJuegoDeVotacionUnoATodos,
    equipoJuegoDeVotacionUnoATodos);
}


// tslint:disable-next-line:max-line-length
public DameInscripcionesEquipoJuegoDeVotacionUnoATodos(juegoId: number): Observable<EquipoJuegoDeVotacionUnoATodos[]> {
  return this.http.get<EquipoJuegoDeVotacionUnoATodos[]>(this.APIUrlEquipoJuegoDeVotacionUnoATodos
    + '?filter[where][juegoDeVotacionUnoATodosId]=' + juegoId);
}

public BorraInscripcionEquipoJuegoDeVotacionUnoATodos(equipoJuegoDeVotacionUnoATodosId: number) {
  // tslint:disable-next-line:max-line-length
  return this.http.delete<EquipoJuegoDeVotacionUnoATodos>(this.APIUrlEquipoJuegoDeVotacionUnoATodos + '/' + equipoJuegoDeVotacionUnoATodosId);
}


// tslint:disable-next-line:max-line-length
public ModificaInscripcionEquipoJuegoDeVotacionUnoATodos(inscripcion: EquipoJuegoDeVotacionUnoATodos): Observable<EquipoJuegoDeVotacionUnoATodos> {
  return this.http.put<EquipoJuegoDeVotacionUnoATodos>(this.APIUrlEquipoJuegoDeVotacionUnoATodos + '/' + inscripcion.id, inscripcion);
}


//////////////// recurosos libros////////////////////////////////////////

  // public recuperarListaRecursos(profesorId): Observable<RecursoLibro[]> {
  //   return this.http.get<RecursoLibro[]>(this.APIUrlProfesores  + '/' + profesorId + '/recursosLibros');
  // }

  // public recuperarRecursosLibro(profesorId, recurosId): Observable<RecursoLibro> {
  //   return this.http.get<RecursoLibro>(this.APIUrlProfesores  + '/' + profesorId + '/recursosLibros' + '/' + recurosId);
  // }

  // public crearRecursosJuegoLibro(idLibro, recurso): Observable<any> {
  //   return this.http.post<any>(this.APIUrlJuegodeLibro  + '/' + idLibro + '/recursosJuegoLibro' , recurso);
  // }

//   public getImagenesRecurso(containerName, fileName): Observable<any> {
//     return this.httpImagenes.get(this.APIurlImagenesLibros  + '/' + containerName + '/download/' + fileName, { responseType: ResponseContentType.Blob });
//   }


//   public crearConcurso(idLibro: any, concurso: any): Observable<any> {
//     return this.http.post<any>(this.APIUrlJuegodeLibro + '/' + idLibro + '/' + 'juegoLibroConcurso', concurso);
//   }

//   public dameLibro(idJuegoAlumnoLibro): Observable<any> {
//     return this.http.get<any>(this.urlalumnojuego + '/' + idJuegoAlumnoLibro + '/Libro');

//   }

//   public dameunlibro(id): Observable<any> {
//     return this.http.get<any>(this.urllibro + '/' + id);
//   }


//   public dameEscenasLibro(idlibro: string): Observable<any> {
//     return this.http.get<any>(this.urllibro + '/' + idlibro + '/escenas');
//   }


//   public getFramesByEscenaId(id): Observable<any> {
//     return this.http.get<any>(this.urlParaEscena + '/' + id + '/frames');
//   }
//   public getImagen(nameFile: string, contenedor: string): Observable<any> {
//     return this.httpImagenes.get(this.urlimagenes + '/' + contenedor + '/download/' + nameFile,
//       { responseType: ResponseContentType.Blob });
//   }

//   public dameConcurso(idjuegoLibro): Observable<any> {
//     return this.http.get<any>(this.APIUrlJuegodeLibro + '/' + idjuegoLibro + '/juegoLibroConcurso');

// }

// public modificarConcurso(id, concurso): Observable<any> {
//   return this.http.put<any>(this.APIUrlConcursoLibros + '/' + id, concurso);
// }
  /////////////////////////////////////// GESTION JUEGOS DE VOTACION: TODOS A UNO  /////////////////////////////////

  public DameJuegoDeVotacionTodosAUno(juegoDeVotacionTodosAUnoID: number): Observable<JuegoDeVotacionTodosAUno> {
    return this.http.get<JuegoDeVotacionTodosAUno>(this.APIUrlJuegoDeVotacionTodosAUno + '/' + juegoDeVotacionTodosAUnoID);
  }

  public CreaJuegoDeVotacionTodosAUno(juego: JuegoDeVotacionTodosAUno, grupoId: number): Observable<JuegoDeVotacionTodosAUno> {
    return this.http.post<JuegoDeVotacionTodosAUno>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeVotacionTodosAUno', juego);
  }

  public DameJuegosDeVotacionTodosAUno(grupoId: number): Observable<JuegoDeVotacionTodosAUno[]> {
    return this.http.get<JuegoDeVotacionTodosAUno[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeVotacionTodosAUno');
  }

  public BorraJuegoDeVotacionTodosAUno(juegoId: number): Observable<JuegoDeVotacionTodosAUno> {
    return this.http.delete<JuegoDeVotacionTodosAUno>(this.APIUrlJuegoDeVotacionTodosAUno + '/' + juegoId);
  }

  public CambiaEstadoJuegoDeVotacionTodosAUno(juego: JuegoDeVotacionTodosAUno): Observable<JuegoDeVotacionTodosAUno> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeVotacionTodosAUno>(this.APIUrlGrupos + '/' + juego.grupoId + '/juegoDeVotacionTodosAUno/' + juego.id, juego);
  }

  ////////////////////////////////// GESTION VOTACION TODOS A UNO INDIVIDUAL /////////////////////////////////////////////////////////

  public DameAlumnosJuegoDeVotacionTodosAUno(juegoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeVotacionTodosAUno + '/' + juegoId + '/alumnos');
  }

  public InscribeAlumnoJuegoDeVotacionTodosAUno(alumnoJuegoDeVotacionTodosAUno: AlumnoJuegoDeVotacionTodosAUno) {
    return this.http.post<AlumnoJuegoDeVotacionTodosAUno>(this.APIUrlAlumnoJuegoDeVotacionTodosAUno,
      alumnoJuegoDeVotacionTodosAUno);
  }


  // tslint:disable-next-line:max-line-length
  public DameInscripcionesAlumnoJuegoDeVotacionTodosAUno(juegoId: number): Observable<AlumnoJuegoDeVotacionTodosAUno[]> {
    return this.http.get<AlumnoJuegoDeVotacionTodosAUno[]>(this.APIUrlAlumnoJuegoDeVotacionTodosAUno
      + '?filter[where][juegoDeVotacionTodosAUnoId]=' + juegoId);
  }

  public BorraInscripcionAlumnoJuegoDeVotacionTodosAUno(alumnoJuegoDeVotacionTodosAUnoId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete<AlumnoJuegoDeVotacionTodosAUno>(this.APIUrlAlumnoJuegoDeVotacionTodosAUno + '/' + alumnoJuegoDeVotacionTodosAUnoId);
  }


  // tslint:disable-next-line:max-line-length
  public ModificaInscripcionAlumnoJuegoDeVotacionTodosAUno(inscripcion: AlumnoJuegoDeVotacionTodosAUno): Observable<AlumnoJuegoDeVotacionTodosAUno> {
    return this.http.put<AlumnoJuegoDeVotacionTodosAUno>(this.APIUrlAlumnoJuegoDeVotacionTodosAUno + '/' + inscripcion.id, inscripcion);
  }


/////////////////////////////////////// GESTION JUEGOS DE VOTACION A OPCIONES  /////////////////////////////////

public DameJuegoDeVotacionAOpciones(juegoDeVotacionAOpcionesId: number): Observable<JuegoDeVotacionAOpciones> {
  return this.http.get<JuegoDeVotacionAOpciones>(this.APIUrlJuegoDeVotacionAOpciones + '/' + juegoDeVotacionAOpcionesId);
}

public CreaJuegoDeVotacionAOpciones(juego: JuegoDeVotacionAOpciones, grupoId: number): Observable<JuegoDeVotacionAOpciones> {
  return this.http.post<JuegoDeVotacionAOpciones>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeVotacionAOpciones', juego);
}

public DameJuegosDeVotacionAOpciones(grupoId: number): Observable<JuegoDeVotacionAOpciones[]> {
  return this.http.get<JuegoDeVotacionAOpciones[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeVotacionAOpciones');
}

public BorraJuegoDeVotacionAOpciones(juegoId: number): Observable<JuegoDeVotacionAOpciones> {
  return this.http.delete<JuegoDeVotacionAOpciones>(this.APIUrlJuegoDeVotacionAOpciones + '/' + juegoId);
}

public CambiaEstadoJuegoDeVotacionAOpciones(juego: JuegoDeVotacionAOpciones): Observable<JuegoDeVotacionAOpciones> {
  // tslint:disable-next-line:max-line-length
  return this.http.put<JuegoDeVotacionAOpciones>(this.APIUrlGrupos + '/' + juego.grupoId + '/juegoDeVotacionAOpciones/' + juego.id, juego);
}

////////////////////////////////// GESTION VOTACION A OPCIONES INDIVIDUAL /////////////////////////////////////////////////////////

public DameAlumnosJuegoDeVotacionAOpciones(juegoId: number): Observable<Alumno[]> {
  return this.http.get<Alumno[]>(this.APIUrlJuegoDeVotacionAOpciones + '/' + juegoId + '/alumnos');
}

public InscribeAlumnoJuegoDeVotacionAOpciones(alumnoJuegoDeVotacionAOpciones: AlumnoJuegoDeVotacionAOpciones) {
  return this.http.post<AlumnoJuegoDeVotacionAOpciones>(this.APIUrlAlumnoJuegoDeVotacionAOpciones,
    alumnoJuegoDeVotacionAOpciones);
}

   // tslint:disable-next-line:max-line-length
public DameInscripcionAlumnoJuegoDeVotacionAOpciones(juegoId: number, alumnoId: number): Observable<AlumnoJuegoDeVotacionAOpciones[]> {
  return this.http.get<AlumnoJuegoDeVotacionAOpciones[]>(this.APIUrlAlumnoJuegoDeVotacionAOpciones
        + '?filter[where][juegoDeVotacionAOpcionesId]=' + juegoId +  '&filter[where][alumnoId]=' + alumnoId);
}

// tslint:disable-next-line:max-line-length
public DameInscripcionesAlumnoJuegoDeVotacionAOpciones(juegoId: number): Observable<AlumnoJuegoDeVotacionAOpciones[]> {
  return this.http.get<AlumnoJuegoDeVotacionAOpciones[]>(this.APIUrlAlumnoJuegoDeVotacionAOpciones
    + '?filter[where][juegoDeVotacionAOpcionesId]=' + juegoId);
}

public BorraInscripcionAlumnoJuegoDeVotacionAOpciones(alumnoJuegoDeVotacionAOpciones: number) {
  // tslint:disable-next-line:max-line-length
  return this.http.delete<AlumnoJuegoDeVotacionAOpciones>(this.APIUrlAlumnoJuegoDeVotacionAOpciones + '/' + alumnoJuegoDeVotacionAOpciones);
}


// tslint:disable-next-line:max-line-length
public ModificaInscripcionAlumnoJuegoDeVotacionAOpciones(inscripcion: AlumnoJuegoDeVotacionAOpciones): Observable<AlumnoJuegoDeVotacionAOpciones> {
  return this.http.put<AlumnoJuegoDeVotacionAOpciones>(this.APIUrlAlumnoJuegoDeVotacionAOpciones + '/' + inscripcion.id, inscripcion);
}





  // Gestion de rubricas
  public CreaRubrica(rubrica: Rubrica, profesorId: number): Observable<Rubrica> {
    return this.http.post<Rubrica>(this.APIUrlProfesores + '/' + profesorId + '/rubricas', rubrica);
  }
  public BorrarRubrica(rubricaId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete<Rubrica>(this.APIURLRubricas + '/' + rubricaId);
  }

  public DameRubricasProfesor(profesorId: number): Observable<Rubrica[]> {
    return this.http.get<Rubrica[]>(this.APIUrlProfesores + '/' + profesorId + '/rubricas');
  }
  
  public DameRubricasPublicas(): Observable<Rubrica[]> {
    return this.http.get<Rubrica[]>(this.APIURLRubricas
      + '?filter[where][Publica]=true');
  }


  public ModificaRubrica(rubrica: Rubrica): Observable<Rubrica> {
    return this.http.put<Rubrica>(this.APIURLRubricas, rubrica);
  }


  // Imagenes de perfil

  public PonImagenPerfil(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenesPerfil + '/upload', formData);
  }


  public BorraImagenPerfil(ImagenPerfil: string): Observable<any> {

    return this.http.delete<any>(this.APIUrlImagenesPerfil + '/files/' + ImagenPerfil);
  }


  public DameFamiliasDeImagenesDePerfilProfesor(profesorId: number): Observable<FamiliaDeImagenesDePerfil[]> {
    return this.http.get<FamiliaDeImagenesDePerfil[]>(this.APIUrlProfesores + '/' + profesorId + '/familiasImagenesDePerfil');
  }


  public DameFamiliasDeImagenesDePerfilPublicas(): Observable<FamiliaDeImagenesDePerfil[]> {
    return this.http.get<FamiliaDeImagenesDePerfil[]>(this.APIUrlFamiliasDeImagenesDePerfil
      + '?filter[where][Publica]=true');
  }


  public CreaFamiliaDeImagenesDePerfil(familia: FamiliaDeImagenesDePerfil, profesorId: number): Observable<FamiliaDeImagenesDePerfil> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<FamiliaDeImagenesDePerfil>(this.APIUrlProfesores + '/' + profesorId + '/familiasImagenesDePerfil', familia);
  }

  public BorrarFamiliaDeImagenesDePerfil(familiaId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIUrlFamiliasDeImagenesDePerfil + '/' + familiaId);
  }

  public ModificaFamiliaDeImagenesDePerfil(familia: FamiliaDeImagenesDePerfil): Observable<FamiliaDeImagenesDePerfil> {
    return this.http.put<FamiliaDeImagenesDePerfil>(this.APIUrlFamiliasDeImagenesDePerfil + '/' + familia.id, familia);
  }


  //////////////////////////// GESTION DE CUESTIONARIOS DE SATISFACCION /////////////////////////////
  public CreaCuestionarioSatisfaccion(cuestionario: CuestionarioSatisfaccion, profesorId: number): Observable<CuestionarioSatisfaccion> {
    return this.http.post<CuestionarioSatisfaccion>(this.APIUrlProfesores + '/' + profesorId + '/cuestionariosSatisfaccion', cuestionario);
  }

  public DameCuestionarioSatisfaccion(cuestionarioId: number): Observable<CuestionarioSatisfaccion> {
    return this.http.get<CuestionarioSatisfaccion>(this.APIUrlCuestionariosSatisfaccion + '/' + cuestionarioId);
  }

  public ModificaCuestionarioSatisfaccion(cuestionario: CuestionarioSatisfaccion): Observable<CuestionarioSatisfaccion> {
    return this.http.put<CuestionarioSatisfaccion>(this.APIUrlCuestionariosSatisfaccion + '/' + cuestionario.id, cuestionario);
  }

  public DameTodosMisCuestionariosSatisfaccion(profesorId: number): Observable<CuestionarioSatisfaccion[]> {
    return this.http.get<CuestionarioSatisfaccion[]>(this.APIUrlProfesores + '/' + profesorId + '/cuestionariosSatisfaccion');
  }

  public BorraCuestionarioSatisfaccion(cuestionarioId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlCuestionariosSatisfaccion + '/' + cuestionarioId);
  }

  public DameCuestionariosSatisfaccionPublicos(): Observable<CuestionarioSatisfaccion[]> {
   
    return this.http.get<CuestionarioSatisfaccion[]>(this.APIUrlCuestionariosSatisfaccion
      + '?filter[where][Publico]=true');
  }


  /////////////////////////////////////// GESTION JUEGOS DE CUESTIONARIO DE SATISFACCION  /////////////////////////////////

  public DameJuegoDeCuestionarioSatisfaccion(juegoDeCuestionarioSatisfaccionID: number): Observable<JuegoDeCuestionarioSatisfaccion> {
    return this.http.get<JuegoDeCuestionarioSatisfaccion>(this.APIUrlJuegoDeCuestionarioSatisfaccion + '/' + juegoDeCuestionarioSatisfaccionID);
  }

  // tslint:disable-next-line:max-line-length
  public CreaJuegoDeCuestionarioSatisfaccion(juego: JuegoDeCuestionarioSatisfaccion, grupoId: number): Observable<JuegoDeCuestionarioSatisfaccion> {
    return this.http.post<JuegoDeCuestionarioSatisfaccion>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeCuestionarioSatisfaccion', juego);
  }

  public DameJuegosDeCuestionarioSatisfaccion(grupoId: number): Observable<JuegoDeCuestionarioSatisfaccion[]> {
    return this.http.get<JuegoDeCuestionarioSatisfaccion[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeCuestionarioSatisfaccion');
  }

  public BorraJuegoDeCuestionarioSatisfaccion(juegoId: number): Observable<JuegoDeCuestionarioSatisfaccion> {
    return this.http.delete<JuegoDeCuestionarioSatisfaccion>(this.APIUrlJuegoDeCuestionarioSatisfaccion + '/' + juegoId);
  }


  public CambiaEstadoJuegoDeCuestionarioSatisfaccion(juego: JuegoDeCuestionarioSatisfaccion): Observable<JuegoDeCuestionarioSatisfaccion> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeCuestionarioSatisfaccion>(this.APIUrlGrupos + '/' + juego.grupoId + '/juegoDeCuestionarioSatisfaccion/' + juego.id, juego);
  }


  ////////////////////////// GESTION JUEGO DE CUESTIONARIO SASTISFACCION INDIVIDUAL ///////////////////////////////

  public DameAlumnosJuegoDeCuestionarioSatisfaccion(juegoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeCuestionarioSatisfaccion + '/' + juegoId + '/alumnos');
  }

  public InscribeAlumnoJuegoDeCuestionarioSatisfaccion(alumno: AlumnoJuegoDeCuestionarioSatisfaccion) {
    return this.http.post<AlumnoJuegoDeCuestionarioSatisfaccion>(this.APIUrlAlumnoJuegoDeCuestionarioSatisfaccion,
      alumno);
  }


  // tslint:disable-next-line:max-line-length
  public DameInscripcionesAlumnoJuegoDeCuestionarioSatisfaccion(juegoId: number): Observable<AlumnoJuegoDeCuestionarioSatisfaccion[]> {
    return this.http.get<AlumnoJuegoDeCuestionarioSatisfaccion[]>(this.APIUrlAlumnoJuegoDeCuestionarioSatisfaccion
      + '?filter[where][juegoDeCuestionarioSatisfaccionId]=' + juegoId);
  }

  public BorraInscripcionAlumnoJuegoDeCuestionarioSatisfaccion(alumnoId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete<AlumnoJuegoDeCuestionarioSatisfaccion>(this.APIUrlAlumnoJuegoDeCuestionarioSatisfaccion + '/' + alumnoId);
  }


  // tslint:disable-next-line:max-line-length
  public ModificaInscripcionAlumnoJuegoDeCuestionarioSatisfaccion(inscripcion: AlumnoJuegoDeCuestionarioSatisfaccion): Observable<AlumnoJuegoDeCuestionarioSatisfaccion> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDeCuestionarioSatisfaccion>(this.APIUrlAlumnoJuegoDeCuestionarioSatisfaccion + '/' + inscripcion.id, inscripcion);
  }

  //JUEGO DE ENCUESTA RÁPIDA

  public DameJuegoDeEncuestaRapida(juegoDeEncuestaRapidaID: number): Observable<JuegoDeEncuestaRapida> {
    return this.http.get<JuegoDeEncuestaRapida>(this.APIUrlJuegoDeEncuestaRapida + '/' + juegoDeEncuestaRapidaID);
  }

  public CreaJuegoDeEncuestaRapida(juego: JuegoDeEncuestaRapida): Observable<JuegoDeEncuestaRapida> {
    return this.http.post<JuegoDeEncuestaRapida>(this.APIUrlProfesores + '/' + juego.profesorId + '/juegosDeEncuestaRapida', juego);
  }

  public DameJuegosDeEncuestaRapida(profesorId: number): Observable<JuegoDeEncuestaRapida[]> {
   
    return this.http.get<JuegoDeEncuestaRapida[]>(this.APIUrlProfesores + '/' + profesorId + '/juegosDeEncuestaRapida');
  }

  public BorraJuegoDeEncuestaRapida(juegoId: number): Observable<JuegoDeEncuestaRapida> {
    return this.http.delete<JuegoDeEncuestaRapida>(this.APIUrlJuegoDeEncuestaRapida + '/' + juegoId);
  }

  //JUEGO DE VOTACIÓN RÁPIDA

  public DameJuegoDeVotacionRapida(juegoDeVotacionRapidaID: number): Observable<JuegoDeVotacionRapida> {
    return this.http.get<JuegoDeVotacionRapida>(this.APIUrlJuegoDeVotacionRapida + '/' + juegoDeVotacionRapidaID);
  }

  public ModificarJuegoDeEncuestaRapida(juego: JuegoDeEncuestaRapida): Observable<JuegoDeEncuestaRapida> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeEncuestaRapida>(this.APIUrlJuegoDeEncuestaRapida, juego);
  }

  public CreaJuegoDeVotacionRapida(juego: JuegoDeVotacionRapida): Observable<JuegoDeVotacionRapida> {
    return this.http.post<JuegoDeVotacionRapida>(this.APIUrlProfesores + '/' + juego.profesorId + '/juegosDeVotacionRapida', juego);
  }

  public DameJuegosDeVotacionRapida(profesorId: number): Observable<JuegoDeVotacionRapida[]> {
    return this.http.get<JuegoDeVotacionRapida[]>(this.APIUrlProfesores + '/' + profesorId + '/juegosDeVotacionRapida');
  }

  public BorraJuegoDeVotacionRapida(juegoId: number): Observable<JuegoDeVotacionRapida> {
    return this.http.delete<JuegoDeVotacionRapida>(this.APIUrlJuegoDeVotacionRapida + '/' + juegoId);
  }

  public ModificarJuegoVotacionRapida(juego: JuegoDeVotacionRapida): Observable<JuegoDeVotacionRapida> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeVotacionRapida>(this.APIUrlJuegoDeVotacionRapida, juego);
  }

  //JUEGO DE CUESTIONARIO RÁPIDO

  public DameJuegoDeCuestionarioRapido(juegoDeCuestionarioRapidoID: number): Observable<JuegoDeCuestionarioRapido> {
    return this.http.get<JuegoDeCuestionarioRapido>(this.APIUrlJuegoDeAvatar + '/' + juegoDeCuestionarioRapidoID);
  }

  public CreaJuegoDeCuestionarioRapido(juego: JuegoDeCuestionarioRapido): Observable<JuegoDeCuestionarioRapido> {
    return this.http.post<JuegoDeCuestionarioRapido>(this.APIUrlProfesores + '/' + juego.profesorId + '/juegosDeCuestionarioRapido', juego);
  }

  public DameJuegosDeCuestionarioRapido(profesorId: number): Observable<JuegoDeCuestionarioRapido[]> {
    return this.http.get<JuegoDeCuestionarioRapido[]>(this.APIUrlProfesores + '/' + profesorId + '/juegosDeCuestionarioRapido');
  }

  public BorraJuegoDeCuestionarioRapido(juegoId: number): Observable<JuegoDeCuestionarioRapido> {
    return this.http.delete<JuegoDeCuestionarioRapido>(this.APIUrlJuegoDeCuestionarioRapido + '/' + juegoId);
  }

  public ModificarJuegoDeCuestionarioRapido(juego: JuegoDeCuestionarioRapido): Observable<JuegoDeCuestionarioRapido> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeCuestionarioRapido>(this.APIUrlJuegoDeCuestionarioRapido, juego);
  }

  //JUEGO DE COGER TURNO RÁPIDO

  public DameJuegoDeCogerTurnoRapido(juegoDeCogerTurnoRapidoID: number): Observable<JuegoDeCogerTurnoRapido> {
    return this.http.get<JuegoDeCogerTurnoRapido>(this.APIUrlJuegoDeCogerTurnoRapido + '/' + juegoDeCogerTurnoRapidoID);
  }

  public CreaJuegoDeCogerTurnoRapido(juego: JuegoDeCogerTurnoRapido): Observable<JuegoDeCogerTurnoRapido> {
    return this.http.post<JuegoDeCogerTurnoRapido>(this.APIUrlProfesores + '/' + juego.profesorId + '/juegosDeCogerTurnoRapido', juego);
  }

  public DameJuegosDeCogerTurnoRapido(profesorId: number): Observable<JuegoDeCogerTurnoRapido[]> {
    return this.http.get<JuegoDeCogerTurnoRapido[]>(this.APIUrlProfesores + '/' + profesorId + '/juegosDeCogerTurnoRapido');
  }

  public BorraJuegoDeCogerTurnoRapido(juegoId: number): Observable<JuegoDeCogerTurnoRapido> {
    return this.http.delete<JuegoDeCogerTurnoRapido>(this.APIUrlJuegoDeCogerTurnoRapido + '/' + juegoId);
  }


  public ModificarJuegoDeCogerTurnoRapido(juego: JuegoDeCogerTurnoRapido): Observable<JuegoDeCogerTurnoRapido> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeCogerTurnoRapido>(this.APIUrlJuegoDeCogerTurnoRapido, juego);
  }


  // JUEGO DE EVALUACION
  public DameJuegoDeEvaluacion(juegoDeEvaluacionID: number): Observable<JuegoDeEvaluacion> {
    return this.http.get<JuegoDeEvaluacion>(this.APIURLJuegoDeEvaluacion + '/' + juegoDeEvaluacionID);
  }

  public DameJuegosDeEvaluacion(grupoId: number): Observable<JuegoDeEvaluacion[]> {
    return this.http.get<JuegoDeEvaluacion[]>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeEvaluacion');
  }
  public CrearJuegoDeEvaluacion(juego: JuegoDeEvaluacion): Observable<JuegoDeEvaluacion> {
    return this.http.post<JuegoDeEvaluacion>(this.APIURLJuegoDeEvaluacion, juego);
  }
  public BorrarJuegoDeEvaluacion(juegoId: number): Observable<JuegoDeEvaluacion> {
    return this.http.delete<JuegoDeEvaluacion>(this.APIURLJuegoDeEvaluacion + '/' + juegoId);
  }

  public CambiaEstadoJuegoDeEvaluacion(juego: JuegoDeEvaluacion): Observable<JuegoDeEvaluacion> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeEvaluacion>(this.APIURLJuegoDeEvaluacion + '/' + juego.id , juego);
  }
  public CrearEquipoJuegoDeEvaluacion(equipo: EquipoJuegoDeEvaluacion): Observable<EquipoJuegoDeEvaluacion> {
    return this.http.post<EquipoJuegoDeEvaluacion>(this.APIURLEquiposJuegoEvaluado, equipo);
  }
  public BorrarEquipoJuegoDeEvaluacion(equipoJuegoDeEvaluacionId: number): Observable<EquipoJuegoDeEvaluacion> {
    return this.http.delete<EquipoJuegoDeEvaluacion>(this.APIURLEquiposJuegoEvaluado + '/' + equipoJuegoDeEvaluacionId);
  }
  public CrearAlumnoJuegoDeEvaluacion(alumno: AlumnoJuegoDeEvaluacion): Observable<AlumnoJuegoDeEvaluacion> {
    return this.http.post<AlumnoJuegoDeEvaluacion>(this.APIURLAlumnoJuegoEvaluado, alumno);
  }
  public BorrarAlumnoJuegoDeEvaluacion(alumnoJuegoDeEvaluacionId: number): Observable<AlumnoJuegoDeEvaluacion> {
    return this.http.delete<AlumnoJuegoDeEvaluacion>(this.APIURLAlumnoJuegoEvaluado + '/' + alumnoJuegoDeEvaluacionId);
  }
  public DameRelacionAlumnosJuegoDeEvaluacion(juegoId: number): Observable<AlumnoJuegoDeEvaluacion[]> {
    return this.http.get<AlumnoJuegoDeEvaluacion[]>(this.APIURLAlumnoJuegoEvaluado + '?filter[where][juegoDeEvaluacionId]=' + juegoId);
  }
  public EnviarRespuestaAlumnosJuegoDeEvaluacion(relacionId: number, respuesta: any): Observable<AlumnoJuegoDeEvaluacion> {
    return this.http.patch<AlumnoJuegoDeEvaluacion>(this.APIURLAlumnoJuegoEvaluado + '/' + relacionId, respuesta);
  }
  public PonNotaFinalAlumnoJuegoDeEvaluacion(alumnoJuegoDeEvaluacion: AlumnoJuegoDeEvaluacion): Observable<AlumnoJuegoDeEvaluacion> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDeEvaluacion>(this.APIURLAlumnoJuegoEvaluado + '/' + alumnoJuegoDeEvaluacion.id, alumnoJuegoDeEvaluacion);
  }
  public DameAlumnosJuegoDeEvaluacion(juegoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIURLJuegoDeEvaluacion + '/' + juegoId + '/Alumnos');
  }
  public DameRelacionEquiposJuegoDeEvaluacion(juegoId: number): Observable<EquipoJuegoDeEvaluacion[]> {
    return this.http.get<EquipoJuegoDeEvaluacion[]>(this.APIURLEquiposJuegoEvaluado + '?filter[where][juegoDeEvaluacionId]=' + juegoId);
  }
  public EnviarRespuestaEquiposJuegoDeEvaluacion(relacionId: number, respuesta: any): Observable<EquipoJuegoDeEvaluacion> {
    return this.http.patch<EquipoJuegoDeEvaluacion>(this.APIURLEquiposJuegoEvaluado + '/' + relacionId, respuesta);
  }
  public PonNotaFinalEquipoJuegoDeEvaluacion(equipoJuegoDeEvaluacion: EquipoJuegoDeEvaluacion): Observable<EquipoJuegoDeEvaluacion> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDeEvaluacion>(this.APIURLEquiposJuegoEvaluado + '/' + equipoJuegoDeEvaluacion.id, equipoJuegoDeEvaluacion);
  }
  public DameEquiposJuegoDeEvaluacion(juegoId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIURLJuegoDeEvaluacion + '/' + juegoId + '/Equipos');
  }
  public DameEquipoConAlumnos(equipoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlEquipos + '/' + equipoId + '/Alumnos');
  }
  public DameRubrica(rubricaId: number): Observable<Rubrica> {
    return this.http.get<Rubrica>(this.APIURLRubricas + '/' + rubricaId);
  }

  // JUEGO DE CONTROL DE TRABAJO EN EQUIPO
  // tslint:disable-next-line:max-line-length
  public CreaJuegoDeControlDeTrabajoEnEquipo(juego: JuegoDeControlDeTrabajoEnEquipo, grupoId: number): Observable<JuegoDeControlDeTrabajoEnEquipo> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<JuegoDeControlDeTrabajoEnEquipo>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeControlDeTrabajoEnEquipo', juego);
  }


  
  public InscribeAlumnoJuegoDeControlDeTrabajoEnEquipo(alumno: AlumnoJuegoDeControlDeTrabajoEnEquipo) {
    return this.http.post<AlumnoJuegoDeControlDeTrabajoEnEquipo>(this.APIUrlAlumnoJuegoDeControlDeTrabajoEnEquipo, alumno);
  }



  /////////////////////////////// GESTION JUEGO DE CUENTOS //////////////////////////////////
  public InscribeAlumnojuegoDeCuento(alumnoJuegoDeCuento: AlumnoJuegoDeCuento, id) {
    return this.http.post<AlumnoJuegoDeCuento>(this.APIUrlJuegoDeCuento + '/' + id  + '/AlumnosJuegoDeCuento',
      alumnoJuegoDeCuento);

  }
  public CrearJuegoCuento(juego: JuegoDeCuento, grupoId: number) {

    return this.http.post<JuegoDeCuento>(this.APIUrlGrupos + '/' + grupoId + '/JuegoDeCuento', juego);
  }


   public DamejuegosdeCuento(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/JuegoDeCuento');
  }

  public DameAlumnosJuegoCuento(id): Observable<any>  {
  return this.http.get<AlumnoJuegoDeCuento>(this.APIUrlJuegoDeCuento + '/' + id + '/AlumnosJuegoDeCuento');

 }


 public ModificarPermisosJuegoCuento(alumno: AlumnoJuegoDeCuento, id): Observable<AlumnoJuegoDeCuento> {
  return this.http.put<AlumnoJuegoDeCuento>(this.APIUrlJuegoDeCuento + '/' + id + '/AlumnosJuegoDeCuento/' + alumno.id, alumno);
}



  public CrearCarpeta(nombre: any): Observable<any> {

    return this.http.post<any>(this.APIurlImagenesCuentos, nombre);
  }

  public GuardarImagenRecursoCuento(nombre: any, file: FormData): Observable<any> {
    return this.http.post<any>(this.APIurlImagenesCuentos + '/' + nombre + '/upload', file);
  }

  public GuardarRecursoCuento(recurso: any, profesorId): Observable<any> {
    let string = this.APIUrlProfesores + '/' + profesorId + '/recursosCuentos';
    console.log ('POST A ', string);
    return this.http.post<any>(  this.APIUrlProfesores + '/' + profesorId + '/recursosCuentos', recurso);

  }

  
  public OtenerImagenesEscena(nombreCuento):Observable<any[]>{
    return this.http.get<any[]>(this.urlimagenes  + '/' + nombreCuento +'/files');

  }

  public GetEscenasDeRecurso(containerName, fileName): Observable<any> {
    return this.httpImagenes.get(this.urlimagenes  + '/' + containerName + '/download/' + fileName, { responseType: 'blob' });
  }

  public CambiaEstadoJuegoDeCuentos(juegoDePuntos: Juego, juegoDePuntosId: number, grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegoDeCuento/' + juegoDePuntosId, juegoDePuntos);
  }

  public BorraJuegoDeCuento(juegoDePuntosId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDeCuento + '/' + juegoDePuntosId);
  }

  public BorrarAlumnosJuegoDeCuento(juegoDeCuentosId: number):Observable<any> {

    return this.http.delete<any>(this.APIUrlJuegoDeCuento + '/' + juegoDeCuentosId + '/AlumnosJuegoDeCuento') ;

  }

  public BorrarCuentoDeAlumno(id: number):Observable<any> {

    return this.http.delete<any>(this.APIurlCuento + '/' +id) ;

  }


  public BorrarElementoDeEscena(escenaId: number):Observable<any> {

    return this.http.delete<any>(this.urlParaEscena + '/' + escenaId + '/Elementos') ;

  }

  public BorrarEscena(escenaId: number):Observable<any> {

    return this.http.delete<any>(this.urlParaEscena + '/' + escenaId) ;

  }



  public dameEscenas(cuentoId): Observable<any> {
    return this.http.get<any>(this.urlParaEscena + '?filter[where][cuentoId]=' + cuentoId);

  }

  public dameCuento(idJuegoAlumnoCuento): Observable<any> {
    return this.http.get<any>(this.APIurlAlumnoJuego + '/' + idJuegoAlumnoCuento + '/Cuento');

  }

  //////////////////////////////////////// RECURSOS CUENTOS ////////////////////////////////////////

  public recuperarListaRecursos(profesorId): Observable<RecursoCuento[]> {
    return this.http.get<RecursoCuento[]>(this.APIUrlProfesores  + '/' + profesorId + '/recursosCuentos');
  }

  public recuperarRecursosCuento(profesorId, recurosId): Observable<RecursoCuento> {
    return this.http.get<RecursoCuento>(this.APIUrlProfesores  + '/' + profesorId + '/recursosCuentos' + '/' + recurosId);
  }


  public getImagenesRecurso(containerName, fileName): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpImagenes.get(this.APIurlImagenesCuentos  + '/' + containerName + '/download/' + fileName, { responseType:'blob'});
  }
//
  public crearRecursosJuegoCuento(idLibro, recurso): Observable<any> {
    return this.http.post<any>(this.APIUrlJuegoDeCuento  + '/' + idLibro + '/RecursosJuegoDeCuentos' , recurso);
  }

  public obtenerImagenesEscena(nombreCuento): Observable<any[]>{
    return this.http.get<any[]>(this.urlimagenes  + '/' + nombreCuento +'/files');

  }

  public getEscenasDeRecurso(containerName, fileName): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpImagenes.get(this.urlimagenes  + '/' + containerName + '/download/' + fileName, { responseType: 'blob' });
  }

  public borrarCarpeta(nombreCuento): Observable<any>{
    return this.http.delete<any>(this.urlimagenes  + '/' + nombreCuento);

  }

  public borrarRecursoJuegoDeCuento(juegoId: number):Observable<any> {

    return this.http.delete<any>(this.APIUrlRecursosJuegoDeCuento + '/' + juegoId) ;
  }


  
    public DameCarpeta(nombre: any): Observable<any> {

      return this.http.get<any>(this.APIurlRecursosCuentos+'?filter[where][carpeta]='+nombre);
    }
  
  
    public BorrarRecursosCuento(id: number):Observable<any> {
  
      return this.http.delete<any>(this.APIurlRecursosCuentos + '/' + id) ;
  
    }




  public DameJuegosDeControlDeTrabajoEnEquipo(grupoId: number): Observable<JuegoDeControlDeTrabajoEnEquipo[]> {
    return this.http.get<JuegoDeControlDeTrabajoEnEquipo[]>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeControlDeTrabajoEnEquipo');
  }

  
  // tslint:disable-next-line:max-line-length
  public DameInscripcionesAlumnosJuegoDeControlDeTrabajoEnEquipo(juegoId: number): Observable<AlumnoJuegoDeControlDeTrabajoEnEquipo[]> {
    return this.http.get<AlumnoJuegoDeControlDeTrabajoEnEquipo[]>(this.APIUrlAlumnoJuegoDeControlDeTrabajoEnEquipo
      + '?filter[where][juegoDeControlDeTrabajoEnEquipoId]=' + juegoId);
  }


  public BorrarInscripcionAlumnoJuegoDeControlDeTrabajoEnEquipo(inscripcionId: number): Observable<AlumnoJuegoDeControlDeTrabajoEnEquipo> {
    return this.http.delete<AlumnoJuegoDeControlDeTrabajoEnEquipo>(this.APIUrlAlumnoJuegoDeControlDeTrabajoEnEquipo + '/' + inscripcionId);
  }

  public BorrarJuegoDeControlDeTrabajoEnEquipo(juegoId: number): Observable<JuegoDeControlDeTrabajoEnEquipo> {
    return this.http.delete<JuegoDeControlDeTrabajoEnEquipo>(this.APIUrlJuegoDeControlDeTrabajoEnEquipo + '/' + juegoId);
  }

  public CambiaEstadoJuegoDeControlDeTrabajoEnEquipo(juego: JuegoDeControlDeTrabajoEnEquipo): Observable<JuegoDeControlDeTrabajoEnEquipo> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<JuegoDeControlDeTrabajoEnEquipo>(this.APIUrlJuegoDeControlDeTrabajoEnEquipo + '/' + juego.id , juego);
  }

   // tslint:disable-next-line:max-line-length
   public DameInscripcionAlumnoJuegoDeControlDeTrabajoEnEquipo(juegoId: number, alumnoId: number): Observable<AlumnoJuegoDeControlDeTrabajoEnEquipo[]> {
    return this.http.get<AlumnoJuegoDeControlDeTrabajoEnEquipo[]>(this.APIUrlAlumnoJuegoDeControlDeTrabajoEnEquipo
        + '?filter[where][juegoDeControlDeTrabajoEnEquipoId]=' + juegoId +  '&filter[where][alumnoId]=' + alumnoId);
  }



  //---------------  GESTIÓN DE REGISTRO Y GRÁFICOS DE ACTIVIDAD (EVENTOS) ---------------//
  public DameEvento(eventoID: number): Observable<Evento> {
    return this.http.get<Evento>(this.APIUrlEventos + '/' + eventoID);
  }

  public DameEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.APIUrlEventos);
  }

  public DameEventosFiltrados(filtros: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.APIUrlEventos + '/' + filtros);
  }

  public CreaEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.APIUrlEventos, evento);
  }

  /* public ModificaEvento(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>();
  }
  */

  public BorraEvento(eventoId: number): Observable<Evento> {
    return this.http.delete<any>(this.APIUrlEventos + '/' + eventoId);
  } 

   ///////////////////////////////////////////// GESTION JUEGO MEMORAMA //////////////////////////////////////////////

    // SE USA PARA EDITAR LA COLECCIÓN DEL PROFESOR. AMBOS IDENTIFICADORES LOS PASAMOS COMO PARÁMETRO

    public CreaFamilia(familia: any, profesorId: number): Observable<any> {
      return this.http.post<any>(this.APIUrlProfesores + '/' + profesorId + '/familiasMemorama', familia);
    }
    public DameFamiliaMemorama(familiaId: number): Observable<any> {
      return this.http.get<any>(this.APIUrlFamiliasMemorama + '/' + familiaId);
    }
    public PonImagenFamiliaMemorama(formData: FormData): Observable<any> {
      return this.http.post<any>(this.APIUrlImagenesFamiliaMemorama + '/upload', formData);
    }
  
    public DameImagenFamiliaMemorama(imagen: string): Observable<any> {
      return this.httpImagenes.get(this.APIUrlImagenesFamiliaMemorama + '/download/' + imagen,
        { responseType: 'blob' });
    }

    public BorraFamiliaMemorama(familiaId: number, profesorId: number): Observable<any> {

      return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/familiasMemorama/' + familiaId);
    }
  
    // public PonCartaFamilia(carta: Carta, familiaId: number): Observable<Carta> {
    //   return this.http.post<Carta>(this.APIUrlFamiliasMemorama + '/' + familiaId + '/cartasMemorama', carta);
    // }

    public PonCartaFamilia(carta: Carta): Observable<Carta> {
      return this.http.post<Carta>(this.APIUrlCartaMemorama, carta);
    }
  
    public PonImagenCarta(formData: FormData): Observable<any> {
      return this.http.post<any>(this.APIUrlImagenesCartasMemorama + '/upload', formData);
    }

    public DameImagenCarta(imagen: string): Observable<any> {
      return this.httpImagenes.get(this.APIUrlImagenesCartasMemorama + '/download/' + imagen,
        { responseType: 'blob' });
    }

    public ModificaFamilia(familia: Familia): Observable<Familia> {
      return this.http.put<Familia>(this.APIUrlFamiliasMemorama + '/' + familia.id, familia);
    }
  
    public ModificaCartaFamilia(carta: any, familiaId: number, cartaId: number): Observable<Cromo> {
      return this.http.put<Cromo>(this.APIUrlFamiliasMemorama + '/' + familiaId + '/cartasMemorama/' + cartaId, carta);
    }
  
    public BorrarCarta(cartaId: number): Observable<any> {
      return this.http.delete<any>(this.APIUrlCartaMemorama + '/' + cartaId);
    }
  
    public DameCartasFamilia(familiaId: number): Observable<any[]> {
      return this.http.get<any[]>(this.APIUrlFamiliasMemorama + '/' + familiaId + '/cartasMemorama');
    }
  
    public BorrarImagenFamilia(ImagenFamilia: string): Observable<any> {
  
      return this.http.delete<any>(this.APIUrlImagenesFamiliaMemorama + '/files/' + ImagenFamilia);
    }
  
    public BorrarImagenCarta(ImagenCarta: string): Observable<any> {
      return this.http.delete<any>(this.APIUrlImagenesCartasMemorama + '/files/' + ImagenCarta);
    }


      // SE USA PARA EDITAR LA COLECCIÓN DEL PROFESOR. AMBOS IDENTIFICADORES LOS PASAMOS COMO PARÁMETRO
    public ModificaFamiliaMemorama(familia: any, profesorId: number, familiaId: number): Observable<Coleccion> {
      return this.http.put<Coleccion>(this.APIUrlProfesores + '/' + profesorId + '/familiasMemorama/' + familiaId, familia);
    }

    public DameFamiliasDelProfesor(profesorId: number): Observable<any[]> {
      return this.http.get<any[]>(this.APIUrlProfesores + '/' + profesorId + '/familiasMemorama');
    }
    public DameFamiliasPublicas(): Observable<Familia[]> {
      return this.http.get<Familia[]>(this.APIUrlFamiliasMemorama
        + '?filter[where][Publica]=true');
    }
  


    // SE USA PARA EDITAR UNA CARTA
  public ModificaCarta(carta: Carta, cartaId:number): Observable<Carta> {
    return this.http.put<Carta>(this.APIUrlCartaMemorama + '/' + cartaId, carta);
  }


  public DamealumnosjuegoMemorama(juegoid:number): Observable<any>{
    console.log(this.APIUrlAlumnoJuegoDeMemorama + '?filter[where][juegoDeMemoramaId]='+juegoid);
    return this.http.get<any>(this.APIUrlAlumnoJuegoDeMemorama + '?filter[where][juegoDeMemoramaId]='+juegoid);
  }

  public CambiaEstadoJuegoDeMemorama(juego: Juego): Observable<Juego> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Juego>(this.APIURLJuegoDeMemorama + '/' + juego.id , juego);
  }
  public BorraJuegoDeMemorama(juegoDeMemoramaId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIURLJuegoDeMemorama + '/' + juegoDeMemoramaId);
  }
  
  

  public CreaJuegoDeMemorama(juego: JuegoMEMORAMA, grupoId: number): Observable<JuegoMEMORAMA> {
    
    return this.http.post<JuegoMEMORAMA>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeMemorama', juego);
  }
  
  public DameJuegoDeMemoramaGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeMemorama');
  }
  public BorraInscripcionAlumnoJuegoDeMemorama(inscripcionId: number): any {
    return this.http.delete<any>(this.APIUrlAlumnoJuegoDeMemorama + '/' + inscripcionId);
  }


  public InscribeAlumnoJuegoDeMemorama(alumnoJuegoDeMemorama: AlumnoJuegoDeMemorama) {
    return this.http.post<AlumnoJuegoDeMemorama>(this.APIUrlAlumnoJuegoDeMemorama, alumnoJuegoDeMemorama);
  }
  

  public DameInfoAlumnosJuegoDeMemorama(juegoDeMemoramaId: number): Observable<any> {

    return this.http.get<any>(this.APIURLJuegoDeMemorama + '/' + juegoDeMemoramaId + '/alumnos');
  
  }
 
  public InscribeEquipoJuegoDeMemorama(equipoJuegoDeMemorama: EquipoJuegoDeMemorama) {
    return this.http.post<EquipoJuegoDeMemorama>(this.APIUrlEquipoJuegoDeMemorama, equipoJuegoDeMemorama);

  }

  






}
